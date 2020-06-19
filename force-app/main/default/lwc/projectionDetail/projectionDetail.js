import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import projectionResources from '@salesforce/resourceUrl/fifty_ninety';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { EVENT_PROJECTION_LIST_CHANGED, EVENT_PROJECTION_CLICKED } from 'c/constants';
import ProjectionService from 'c/projectionService';

export default class ProjectionDetail extends LightningElement {
    @track projection = null;
    @track projectionSummaryColumns;
    @track projectionTableData;
    @wire(CurrentPageReference) pageRef; // required by pubsub
    @track appResources = {};

    connectedCallback() {
            registerListener(EVENT_PROJECTION_CLICKED, this.onProjectionClicked, this);
            registerListener(EVENT_PROJECTION_LIST_CHANGED, this.onProjectionListChanged, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    get hasProjection() {
        const ret = this.projection != null;
        return ret;
    }

    onProjectionClicked(projection) {
        this.projection = projection;
        this.appResources.projectionIcon = `${projectionResources}/${ProjectionService.getIconPath(this.projection.WorkType__c)}`;
    }

    onProjectionListChanged() {
        this.projection = null;
    }
}