/* eslint-disable no-console */
import { LightningElement, track, wire, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin,CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { EVENT_PROJECTION_FEATURE_CREATED } from 'c/constants';
import { ProjectionFeature } from 'c/projectionModels';
import { createRecordInputFilteredByEditedFields } from 'lightning/uiRecordApi';

export default class ProjectionFeatureCreate extends NavigationMixin(LightningElement) {
    projectionInfo;
    @api projectionId;
    @api teamId;
    @api nextFeatureIndex = 0;
    @api productTagId;
    @api epicId;
    @track projectionFeatureRecordTypeId;
    @wire(CurrentPageReference) pageRef; //required by pubsub

    @wire(getObjectInfo, { objectApiName: 'FN_Projection__c' })
    loadInfo(result){
        try {
            if(result) {
                if(result.error) {
                    // handle this condition
                } else if(result.data && result.data.recordTypeInfos) {
                    const rtis = result.data.recordTypeInfos;
                    this.projectionFeatureRecordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'Feature');
                    this.projectionInfo = result.data;
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
        try {
            event.preventDefault();
            const fields = event.detail.fields;
            fields.ProjectionSheet__c = this.projectionId;
            fields.Team__c = this.teamId;
            fields.ProductTag__c = this.productTagId;
            fields.Epic__c = this.epicId;
            fields.FeatureOrder__c = this.nextFeatureIndex;
            const form = this.template.querySelector('lightning-record-edit-form');
            form.submit(fields);
        } catch (error) {
            // handle error - show toast or something.
            console.log(error);
        }
    }

    onCreateFeatureSuccess(event) {
        try {
            const feature = event.detail;

            //increment nextFeatureIndex
            this.nextFeatureIndex++;

            // bubble event and add to sheet's feature collection
            fireEvent(this.pageRef, EVENT_PROJECTION_FEATURE_CREATED, this.translateRecord(feature));

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
                message: `Feature "${feature.fields.Name.value}" has been added to the sheet`,
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
        console.log(JSON.stringify(event.detail, null, 2));
    }

    translateRecord(record) {
        const feature = new ProjectionFeature();
        feature.id = record.id;
        feature.name = record.fields.Name.value;
        feature.description = record.fields.Description__c.value;
        feature.featureOrder = record.fields.FeatureOrder__c.value;
        feature.projectionId = record.fields.ProjectionSheet__c.value;
        feature.epicId = record.fields.Epic__c.value;
        feature.productTagId = record.fields.ProductTag__c.value;
        
        return feature;
    }
}