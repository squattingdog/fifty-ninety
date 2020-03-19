import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { EVENT_PROJECT_LIST_CHANGED, EVENT_PROJECT_CLICKED } from 'c/constants';
import ProjectService from 'c/projectService';

export default class ProjectDetail extends LightningElement {
    @track project = null;
    @track projectSummaryColumns;
    @track projectTableData;
    @wire(CurrentPageReference) pageRef; // required by pubsub
    @track appResources = {};

    connectedCallback() {
            registerListener(EVENT_PROJECT_CLICKED, this.onProjectClicked, this);
            registerListener(EVENT_PROJECT_LIST_CHANGED, this.onProjectListChanged, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    get description() {
        return decodeURIComponent(this.project.Description__c);
    }

    get hasProject() {
        const ret = this.project != null;
        return ret;
    }

    onProjectClicked(project) {
        this.project = project;
        this.appResources.projectIcon = `${projectResources}/${ProjectService.getIconPath(this.project.WorkType__c)}`;
    }

    onProjectListChanged() {
        this.project = null;
    }
}