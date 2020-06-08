import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { EVENT_PROJECTION_CREATED } from 'c/constants';

export default class ProjectionSheetCreate extends LightningElement {
    @track projectionSheetRecordTypeId;
    @track showModal;
    @track errorMessage;
    @track fields= ['Name', 'Description__c', 'Status__c', 'ProductTag__c', 'Team__c', 'WorkType__c', 'RateOfWork__c'];
    @wire(CurrentPageReference) pageRef;

    @wire(getObjectInfo, { objectApiName: 'FN_Projection__c' })
    loadInfo(result) {
        try {
            if(result) {
                if(result.error) {
                    // handle this condition
                } else if(result.data && result.data.recordTypeInfos) {
                    const rtis = result.data.recordTypeInfos;
                    this.projectionSheetRecordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'Sheet');
                } else {
                    // handle this condition
                }
            } else {
                // handle this condition
            }
        } catch (error) {
            // handle error
        }
    }

    get modalClass() {
        return `slds-modal slds-modal_small ${this.showModal ? 'slds-fade-in-open' : ''}`;
    }

    get modalBackdropClass() {
        return `slds-backdrop ${this.showModal ? 'slds-backdrop_open': ''}`;
    }

    onNewSheetClicked(event) {
        console.log('onNewProjectionClick');
        this.showModal = true;
    }

    onCancelNewSheetClicked(event) {
        console.log('onCancelNewProjectionClicked');
        this.showModal = false;
    }

    onSaveNewSheetClicked(event) {
        try {
            event.preventDefault();
            const fields = event.detail.fields;
            const form = this.template.querySelector('lightning-record-edit-form');
            form.submit(fields);
        } catch (err) {
            // handle error - show toast or something.
            console.log(error);
        }
    }

    onCreateSheetError(event) {
        this.errorMessage = event.detail;
    }

    onCreateSheetSuccess(event) {
        this.showModal = false;

        // show toast message
        const toastEvent = new ShowToastEvent({
            title: 'Projection Sheet Created',
            message: `Sheet "${event.detail.fields.Name.value}" has been created.`,
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);

        // bubble event to add to collection
        // commented event because it is causing an error when the apex method is imperitively called. 
        //   need to investigate later - this isn't MVP.
        // fireEvent(this.pageRef, EVENT_PROJECTION_CREATED, event.detail);
    }
}