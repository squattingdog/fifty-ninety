import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { EVENT_PROJECT_LIST_CHANGED, EVENT_PROJECT_CLICKED } from 'c/constants';

export default class ProjectDetail extends LightningElement {
    @track project = null;
    @wire(CurrentPageReference) pageRef; // required by pubsub
    appResources = {
        projectIcon: projectResources + `/img/f-n-e.svg`
    };

    connectedCallback() {
        // eslint-disable-next-line no-console
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
    }

    onProjectListChanged() {
        this.project = null;
    }
}