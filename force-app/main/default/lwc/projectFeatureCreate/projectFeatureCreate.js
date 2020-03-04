/* eslint-disable no-debugger */
/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProjectFeatureCreate extends LightningElement {
    projectInfo;
    @api projectId;
    @api teamId;
    @track projectFeatureRecordTypeId;

    @wire(getObjectInfo, { objectApiName: 'FN_Project__c' })
    loadInfo(result){
        try {
            if(result) {
                if(result.error) {
                    // handle this condition
                } else if(result.data && result.data.recordTypeInfos) {
                    const rtis = result.data.recordTypeInfos;
                    this.projectFeatureRecordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'Feature');
                    this.projectInfo = result.data;
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

    onCreateFeatureClick(event) {
        console.log('add clicked');
        try {
            event.preventDefault();
            const fields = event.detail.fields;
            fields.ProjectSheet__c = this.projectId;
            fields.Team__c = this.teamId;
            console.log(fields);
            const form = this.template.querySelector('lightning-record-edit-form');
            console.log(form);
            form.submit(fields);
            console.log('sent data');
        } catch (error) {
            // handle error - show toast or something.
            console.log(error);
        }
    }

    onCreateFeatureSuccess(event) {
        try {
            console.log('in success handler');
            const record = event.payload;
            console.log(record);

            // bubble event and add to sheet's feature collection
            

            // reset the form
            const fields = this.template.querySelectorAll('lightning-input-field');
            if(fields) {
                fields.forEach(field => { 
                    field.reset(); 
                });
            }

            // show toast message
            const toastEvent = new ShowToastEvent({
                title: 'Feature Created',
                message: `Feature "${record.Name}" has been added to the sheet`,
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);

        } catch(error) {
            console.log('in catch');
            console.log(error);
        }
    }

    onCreateFeatureError(event) {
        console.log('onCreateError');
        console.log(event.detail);
        console.log(JSON.stringify(event.detail));
    }
}