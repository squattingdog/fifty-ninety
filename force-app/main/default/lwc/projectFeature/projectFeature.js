import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { ProjectItem } from 'c/projectModels';

export default class ProjectFeature extends LightningElement {
    @api feature;
    @track featureItems;
    @api columns;

    connectedCallback() {
        // @track does not track child collections - need to pull out child collections as a separtely tracked object/array.
        this.featureItems = Array.from(this.feature.projectItems);
        // console.log('on connected callback');
    }

    onRowActionClicked(event) {
        console.log(event.detail);
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
            newItem.Project__c = this.feature.id;
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
        // console.log('onCreateItemSuccess');
        try {
            const featureItem = new ProjectItem();
            this.mapNewFeatureItem(event.detail, featureItem);

            // add to existing collection
            this.featureItems.push(featureItem);
            // this datatable will not auto refresh the UI without making a new copy of the array. 
            //    array.push does not work, but array.push does work in the parent datatable in projectSheet.js.
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
        // console.log('mapNewFeatureItem');
        
        featureItem.id = apiObject.id;
        featureItem.name = apiObject.fields.Name.value;
        featureItem.description = apiObject.fields.Details__c.value;
        featureItem.itemOrder = apiObject.fields.ItemOrder__c.value;
    }
}