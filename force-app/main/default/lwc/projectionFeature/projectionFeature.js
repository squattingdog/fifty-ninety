import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { ProjectionItem } from 'c/projectionModels';
import { DT_EVENT_CREATE_WORK_ITEM } from 'c/constants';
import FeatureItemMapper from 'c/featureItemMapper';
import apexCreateWorkItem from '@salesforce/apex/FN_ProjectionController.createWorkItem';

export default class ProjectionFeature extends LightningElement {
    @api workRecordTypeId;
    @api feature;
    @api productTagId;
    @api teamId;
    @track featureItems;

    // FIELDS
    @track columns = [
        { label: 'Name', fieldName: 'name', initialWidth: 250, editable: true, sortable: false },
        { label: 'Description', fieldName: 'description', initialWidth: 500, editable: true, sortable: false, warpText: true},
        { label: '50-Size', fieldName: 'fiftySize', type: 'number', initialWidth: 85, editable: true, sortable: false, cellAttributes: {alignment: 'left'} },
        { label: '90-Size', fieldName: 'ninetySize', type: 'number', initialWidth: 85, editable: true, sortable: false, cellAttributes: {alignment: 'left'} },
        { label: 'Work Item', fieldName: 'workItemUrl', type: 'url', sortable: false, typeAttributes: {label: {fieldName: 'workItemName'}, target: '_blank'}},
        { label: 'Work Size', fieldName: 'workItemSize', type: 'number', sortable: false, cellAttributes: {alignment: 'left'} },
        { label: 'Work Status', fieldName: 'workItemStatus', type: 'text', sortable: false },
        { type: 'action', typeAttributes: {rowActions: {fieldName: 'rowActions'}}}
    ];

    connectedCallback() {
        // short circuit if projection items is not defined.
        if (!this.feature.projectionItems) { return; }

        // iterate projection items to build custom values.
        this.feature.projectionItems.forEach(i => {
            //i.rowActions = [];
            if(i.workItemName == undefined || i.workItemName == '' || i.workItemName == null) {
                i.rowActions = [];
                i.rowActions.push({ label: 'Create Work Item', name: DT_EVENT_CREATE_WORK_ITEM });
            }
        })
        // @track does not track child collections - need to pull out child collections as a separtely tracked object/array.
        this.featureItems = this.feature.projectionItems ? Array.from(this.feature.projectionItems) : [];
    }

    onCellChanged(event) {
        const draftValues = event.detail.draftValues[0];
        console.log(`Changing: ${JSON.stringify(draftValues, null, 2)}`);
        console.log(`row id: ${draftValues.id}`);

        try{
            const featureLineItem = {
                'fields': FeatureItemMapper.fromProjectionItem(draftValues)
            };

            console.log(`featureLineItem: ${JSON.stringify(featureLineItem, null, 2)}`);
       
            updateRecord(featureLineItem)
            .then(() => {
                this.updateUIFeature(draftValues);

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Updated feature line',
                        variant: 'success'
                    })
                );
            })
            .catch(ex => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Saving Record',
                        message: `error message: error updating record with values: ${JSON.stringify(featureLineItem, null, 2)}`,
                        variant: 'error'
                    })
                );
                console.log(ex);
            });
        } catch(ex) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Page Exception',
                    message: 'An exception occurred while process the action.',
                    variant: 'error'
                })
            );
            console.log(ex);
        }
    }

    onRowActionClicked(event) {
        event.preventDefault();
        console.log(JSON.stringify(event, null, 2));
        const menuItemName = event.detail.action.name;
        switch(menuItemName) {
            case DT_EVENT_CREATE_WORK_ITEM:
                // create the work item
                this.createTheWorkItem(event.detail);
                break;
        }
    }

    onDeleteClicked(event) {
        console.log(event.detail);
    }

    onCreateItemClick(event) {
        try {
            // stop event propagation - we submit the form at the end of this method.
            event.preventDefault();
            // console.log(`onCreateItemClick`);

            // get the fields object and set the values of the fields not shown to the user.
            const newItem = event.detail.fields;
            newItem.Projection__c = this.feature.id;
            newItem.ItemOrder__c = this.featureItems.length + 1;

            // set the new item values from the form fields.
            const form = this.template.querySelector('lightning-record-edit-form');
            const formFields = form.querySelectorAll('lightning-input');
            formFields.forEach(field => {
                this.setNewItemFieldValue(field, newItem);
            });

            // submit form         
            form.submit(newItem);
        } catch (error) {
            // handle error - TODO: show toast or something.
            console.log(error);
        }
    }

    onCreateItemSuccess(event) {
        try {
            const featureItem = new ProjectionItem();
            this.mapNewFeatureItem(event.detail, featureItem);

            // add to existing collection
            this.featureItems.push(featureItem);
            // this datatable will not auto refresh the UI without making a new copy of the array. 
            //    array.push does not work, but array.push does work in the parent datatable in projectionSheet.js.
            //    not sure why this is, needs to be investigated.
            this.featureItems = Array.from(this.featureItems);

            // reset the form
            const fields = this.template.querySelectorAll('lightning-input');
            if(fields) {
                fields.forEach(field => { 
                    field.value = ''; 
                });
            }

            // show toast message
            const toastEvent = new ShowToastEvent({
                title: 'Feature Item Created',
                message: `"${featureItem.name}" has been added to the "${this.feature.name}" feature.`,
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);

        } catch(error) {
            console.log('in catch');
            console.log(error);
        }
    }

    onCreateItemError(event) {
        console.log('onCreateError');
        console.log(JSON.stringify(event.detail, null, 2));
    }

    setNewItemFieldValue(control, record) {
        switch(control.name) {
            case 'name':
                record.Name = control.value;
                break;

            case 'description':
                record.Details__c = control.value;
                break;
        }
    }

    mapNewFeatureItem(apiObject, featureItem) {
        featureItem.id = apiObject.id;
        featureItem.name = apiObject.fields.Name.value;
        featureItem.description = apiObject.fields.Details__c.value;
        featureItem.itemOrder = apiObject.fields.ItemOrder__c.value;
    }

    updateUIFeature(featureItem) {
        
        if(!featureItem.fiftySize && !featureItem.ninetySize) {
            return;
        }

        let itemIndex = -1;
        let fiftySize, ninetySize = 0;
        this.featureItems.forEach((i, idx) => {if(i.id === featureItem.id) { itemIndex = idx; }});
        const originalFeatureItem = this.featureItems[itemIndex];
        
        console.log(`original feature item: ${JSON.stringify(originalFeatureItem, null, 2)}`);
        
        if(featureItem.fiftySize) {
            fiftySize = featureItem.fiftySize;
            ninetySize = originalFeatureItem.ninetySize;
        } else if(featureItem.ninetySize) {
            fiftySize = originalFeatureItem.fiftySize;
            ninetySize = featureItem.ninetySize;
        }

        if(fiftySize > ninetySize) {
            return;
        }
        originalFeatureItem.fiftySize = fiftySize;
        originalFeatureItem.ninetySize = ninetySize;
        return;
    }

    createTheWorkItem(data) {
        // save work item and line item
        const params = {
            workRecordTypeId: this.workRecordTypeId,
            productTagId: this.productTagId,
            projectionLineId: data.row.id,
            name: data.row.name,
            description: data.row.description,
            epicId: this.feature.epicId,
            teamId: this.teamId
        }

        // call apex controller and create work item
        apexCreateWorkItem(params)

        // handle callback
        .then(result => {
            // update line item properties with work item data.  CreateWorkItem does not query for the projectionLine 
            //   record updates.  Need to handle that here by defaulting some values.  Rely on the user to refresh
            //   the page for the most up-to-date data.
            const rowIndex = this.featureItems.findIndex(item => {
                return item.id == result.Id;
            });

            const row = this.featureItems[rowIndex];
            row.workItemName = result.WorkItemName__c;
            row.workItemStatus = result.WorkItemStatus__c;
            row.workItemSize = result.WorkItemSize__c;
            delete row.rowActions;

            this.featureItems = Array.from(this.featureItems);

            // show toast message
            const toastEvent = new ShowToastEvent({
                title: 'Work Item Created',
                message: `"${row.workItemName}" has been created and linked to "${row.name}".`,
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
        }).catch(error => {
            // TODO handler this case.
            console.log('failed');
            console.log(error);
        });
    }
}