/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import { ProjectItem, Project, ProjectFeature } from 'c/projectModels';
import getProjectFeaturesAndLines from '@salesforce/apex/FN_ProjectController.getProjectFeaturesAndLines';
import { PROJECT_LINE_COLUMNS } from 'c/constants';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class ProjectSheet extends LightningElement {
    @api projectId;
    @track sheet;
    @track columns;
    @track hasError = false;
    @track isLoading = true;
    @track error;
    @track title;
    
    /*
    @wire(getProjectFeaturesAndLines, { projectId: '$projectId' })
    loadProjectLines({error, data}) {
        console.log(data);
        console.log(error);
        if (error) {
            this.error = error;
            this.hasError = true;
            this.isLoading = false;
        } else if(data) {
            const transformedData = this.populateProjectItems(data);
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
            console.log('data');
            console.log(data);
            this.columns = PROJECT_LINE_COLUMNS;
            this.sheet = this.populateProjectItems(data);
            console.log('sheet object');
            console.log(this.sheet);
            this.hasError = false;
            this.isLoading = false;
        }).catch(error => {
            this.error = error;
            this.hasError = true;
            this.isLoading = false;
        });
    }

    populateProjectItems(object) {
        // populate the sheet object
        const projectSheet = this.populateProjectSheet(object.project);
        // populate the related project features
        projectSheet.features = new Array();
        if(object.features) {
            object.features.forEach(f => {
                const feature = new ProjectFeature();
                feature.id = f.Id;
                feature.name = f.Name;
                feature.description = f.Descriptoin__c;
                feature.featureOrder = f.FeatureOrder__c;
                feature.projectId = f.Project__c;

                // populate feature project items
                feature.projectItems = new Array();
                    if(f.ProjectLines__r) {
                        f.ProjectLines__r.forEach(i => {
                            const item = this.populateProjectItem(i);
                            feature.projectItems.push(item);
                        });
                    }
                projectSheet.features.push(feature);
            });
        }
        if(object.project.ProjectLines__r) {
            // populate project items not related to a feature
            projectSheet.projectItems = new Array();
            object.project.ProjectLines__r.forEach(line => {
                const item = this.populateProjectItem(line);
                projectSheet.projectItems.push(item);
            });
        }
        return projectSheet;
    }
    
    populateProjectItem(i) {
        const item = new ProjectItem();
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

        return item;
    }

    populateProjectSheet(object) {
        const projectSheet = new Project();
        projectSheet.id = object.Id;
        projectSheet.name = object.Name;
        projectSheet.description = object.Description__c;
        projectSheet.projectedDuration = object.ProjectedDuration__c;
        projectSheet.projectedDurationWithBuffer = object.ProjectedDurationWithBuffer__c;
        projectSheet.rateOfWork = object.RateOfWork__c;
        projectSheet.teamName = object.Team__r.Name;
        projectSheet.teamId = object.Team__r.Id;
        projectSheet.buffer = object.Buffer__c;

        return projectSheet;
    }
}