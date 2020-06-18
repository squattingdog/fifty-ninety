import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { loadStyle } from 'lightning/platformResourceLoader';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// import { refreshApex } from '@salesforce/apex';
import getProjectionFeaturesAndLines from '@salesforce/apex/FN_ProjectionController.getProjectionFeaturesAndLines';
import projectionResources from '@salesforce/resourceUrl/fifty_ninety';
import { EVENT_PROJECTION_FEATURE_CREATED, PROJECTION_LINE_COLUMNS, CSS_PROJECTION_FEATURE, CSS_GENERIC } from 'c/constants';
import { ProjectionItem, Projection, ProjectionFeature } from 'c/projectionModels';
import { registerListener, unregisterAllListeners } from 'c/pubsub';

export default class ProjectionSheet extends LightningElement {
    @api projectionId;
    @track sheet;
    @track features;
    @track columns;
    @track hasError = false;
    @track isLoading = true;
    @track error;
    @track title;
    @track nextFeatureIndex;
    @track workRecordTypeId;
    @wire(CurrentPageReference) pageRef; // required by pubsub

    @wire(getObjectInfo, { objectApiName: 'agf__ADM_Work__c' })
    wireWorkRecordTypeInfo(result){
        try {
            if(result) {
                if(result.error) {
                    // handle this condition
                } else if(result.data && result.data.recordTypeInfos) {
                    const rtis = result.data.recordTypeInfos;
                    this.workRecordTypeId = Object.keys(rtis).find(rti => rtis[rti].name === 'User Story');
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

    connectedCallback() {
        loadStyle(this, projectionResources + CSS_GENERIC);
        loadStyle(this, projectionResources + CSS_PROJECTION_FEATURE);
        getProjectionFeaturesAndLines({projectionId: this.projectionId})
        .then(data => {
            try {
                this.columns = PROJECTION_LINE_COLUMNS;
                const projection = new Projection();
                const projectionFeatures = new Array();
                this.populateProjectionItems(data, projection, projectionFeatures);
                this.sheet = projection;
                this.features = projectionFeatures;
                this.hasError = false;
                this.isLoading = false;
            } catch(err) {
                console.log('projectionSheet::connectedCallback Error')
                console.log(err);
                this.error = err;
                this.hasError = true;
                this.isLoading = false;
            }
        }).catch(err => {
            console.log('projectionSheet::connectedCallback::catch Error')
            console.log(err);
            this.error = err;
            this.hasError = true;
            this.isLoading = false;
        });

        // register event handlers
        registerListener(EVENT_PROJECTION_FEATURE_CREATED, this.onFeatureCreated, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    populateProjectionItems(object, projectionSheet, projectionFeatures) {
        console.log(object.projection);
        console.log(object.features);
        // populate the sheet object
        this.populateProjectionSheet(object.projection, projectionSheet);

        // populate the related projection features
        if(object.features) {
            // capture highest feature order index
            let featureOrderNumber = 0;

            object.features.forEach(f => {
                const feature = new ProjectionFeature();
                feature.id = f.Id;
                feature.name = f.Name;
                feature.description = f.Descriptoin__c;
                feature.featureOrder = f.FeatureOrder__c;
                feature.projectionId = f.Projection__c;
                if (feature.Epic__r) {
                    feature.epicId = f.Epic__r.Id;
                    feature.epicName = f.Epic__r.Name;
                } else {
                    feature.epicId = projectionSheet.epicId;
                    feature.epicName = projectionSheet.epicName;
                }

                // check for larger feature order number and save if found
                if(feature.featureOrder > featureOrderNumber) {
                    featureOrderNumber = feature.featureOrder;
                }
                
                // populate feature projection items
                feature.projectionItems = new Array();
                    if(f.ProjectionLines__r) {
                        f.ProjectionLines__r.forEach(line => {
                            const item = new ProjectionItem(); 
                            this.populateProjectionItem(line, item);
                            feature.projectionItems.push(item);
                        });
                    }
                projectionFeatures.push(feature);
            });

            // increment feature order and save on tracked property
            this.nextFeatureIndex = ++featureOrderNumber;
        }

        // populate projection items not related to a feature
        if(object.projection.ProjectionLines__r) {
            projectionSheet.projectionItems = new Array();
            object.projection.ProjectionLines__r.forEach(line => {
                const item = new ProjectionItem();
                this.populateProjectionItem(line, item);
                projectionSheet.projectionItems.push(item);
            });
        }
    }

    onFeatureCreated(feature) {
        this.features.push(feature);
    }
    
    populateProjectionItem(i, item) {
        item.id = i.Id;
        item.name = i.Name;
        item.description = i.Details__c;
        item.fiftySize = i.FiftySize__c;
        item.ninetySize = i.NinetySize__c;
        item.workItemId = i.WorkItem__c;
        item.workItemName = i.WorkItemName__c;
        item.workItemSize = i.WorkItemSize__c;
        item.workItemStatus = i.WorkItemStatus__c;
        item.itemOrder = i.ItemOrder__c;
    }

    populateProjectionSheet(object, projectionSheet) {
        projectionSheet.id = object.Id;
        projectionSheet.name = object.Name;
        projectionSheet.description = object.Description__c;
        projectionSheet.projectedDuration = object.ProjectedDuration__c;
        projectionSheet.projectedDurationWithBuffer = object.ProjectedDurationWithBuffer__c;
        projectionSheet.rateOfWork = object.RateOfWork__c;
        projectionSheet.teamName = object.Team__r.Name;
        projectionSheet.teamId = object.Team__r.Id;
        projectionSheet.buffer = object.Buffer__c;
        projectionSheet.epicId = object.Epic__r.Id;
        projectionSheet.epicName = object.Epic__r.Name;
        projectionSheet.productTagId = object.ProductTag__c;
    }
}