import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ProjectItem, Project, ProjectFeature } from 'c/projectModels';
import getProjectFeaturesAndLines from '@salesforce/apex/FN_ProjectController.getProjectFeaturesAndLines';
import { PROJECT_LINE_COLUMNS } from 'c/constants';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { loadStyle } from 'lightning/platformResourceLoader';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { EVENT_PROJECT_FEATURE_CREATED } from 'c/constants';

export default class ProjectSheet extends LightningElement {
    @api projectId;
    @track sheet;
    @track features;
    @track columns;
    @track hasError = false;
    @track isLoading = true;
    @track error;
    @track title;
    @track nextFeatureIndex;
    @wire(CurrentPageReference) pageRef; // required by pubsub
    
    /*
    @wire(getProjectFeaturesAndLines, { projectId: '$projectId' })
    loadProjectLines(results) {
        console.log(results.data);
        console.log(results.error);
        if (results.error) {
            this.error = results.error;
            this.hasError = true;
            this.isLoading = false;
        } else if(results.data) {
            const transformedData = this.populateProjectItems(results.data);
            console.log(transformedData);
            this.sheet = transformedData;
            this.columns = PROJECT_LINE_COLUMNS;
            this.isLoading = false;
            this.hasError = false;
            this.title = `${this.sheet.name} Project Features & Items`;
        }
    }
    */

    connectedCallback() {
        loadStyle(this, projectResources + '/style.css');
        getProjectFeaturesAndLines({projectId: this.projectId})
        .then(data => {
            this.columns = PROJECT_LINE_COLUMNS;
            const project = new Project();
            const projectFeatures = new Array();
            this.populateProjectItems(data, project, projectFeatures);
            this.sheet = project;
            this.features = projectFeatures;
            this.hasError = false;
            this.isLoading = false;
        }).catch(error => {
            this.error = error;
            this.hasError = true;
            this.isLoading = false;
        });

        // register event handlers
        registerListener(EVENT_PROJECT_FEATURE_CREATED, this.onFeatureCreated, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    populateProjectItems(object, projectSheet, projectFeatures) {

        // populate the sheet object
        this.populateProjectSheet(object.project, projectSheet);

        // populate the related project features
        if(object.features) {
            // capture highest feature order index
            let featureOrderNumber = 0;

            object.features.forEach(f => {
                const feature = new ProjectFeature();
                feature.id = f.Id;
                feature.name = f.Name;
                feature.description = f.Descriptoin__c;
                feature.featureOrder = f.FeatureOrder__c;
                feature.projectId = f.Project__c;

                // check for larger feature order number and save if found
                if(feature.featureOrder > featureOrderNumber) {
                    featureOrderNumber = feature.featureOrder;
                }

                // populate feature project items
                feature.projectItems = new Array();
                    if(f.ProjectLines__r) {
                        f.ProjectLines__r.forEach(line => {
                            const item = new ProjectItem(); 
                            this.populateProjectItem(line, item);
                            feature.projectItems.push(item);
                        });
                    }
                projectFeatures.push(feature);
                // projectSheet.features.push(feature);
            });

            // increment feature order and save on tracked property
            this.nextFeatureIndex = ++featureOrderNumber;
        }

        // populate project items not related to a feature
        if(object.project.ProjectLines__r) {
            projectSheet.projectItems = new Array();
            object.project.ProjectLines__r.forEach(line => {
                const item = new ProjectItem();
                this.populateProjectItem(line, item);
                projectSheet.projectItems.push(item);
            });
        }
    }

    onFeatureCreated(feature) {
        this.features.push(feature);
    }
    
    populateProjectItem(i, item) {
        // const item = new ProjectItem();
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

        // return item;
    }

    populateProjectSheet(object, projectSheet) {
        projectSheet.id = object.Id;
        projectSheet.name = object.Name;
        projectSheet.description = object.Description__c;
        projectSheet.projectedDuration = object.ProjectedDuration__c;
        projectSheet.projectedDurationWithBuffer = object.ProjectedDurationWithBuffer__c;
        projectSheet.rateOfWork = object.RateOfWork__c;
        projectSheet.teamName = object.Team__r.Name;
        projectSheet.teamId = object.Team__r.Id;
        projectSheet.buffer = object.Buffer__c;
    }
}