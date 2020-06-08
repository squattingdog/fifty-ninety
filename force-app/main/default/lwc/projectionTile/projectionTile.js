import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import projectionResources from '@salesforce/resourceUrl/fifty_ninety';
import { fireEvent } from 'c/pubsub';
import { EVENT_PROJECTION_CLICKED } from 'c/constants';
import ProjectionService from 'c/projectionService';

export default class ProjectionTile extends NavigationMixin(LightningElement) {
    @api projection;
    @track projectionUrl;
    @track recordPageUrl;
    @wire(CurrentPageReference) pageRef; //required by pubsub

    @track appResources = {
        projectionIcon: '',
        tileClass: ''
    };

    connectedCallback() {
        this.appResources.projectionIcon = `${projectionResources}/${ProjectionService.getIconPath(this.projection.WorkType__c)}`;
        this.appResources.tileClass = `projection-tile ${ProjectionService.getStatusCssClass(this.projection.Status__c)}`;
    }

    onOpenProjectionClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__projectionContainer'
            },
            state: {
                'c__projectionId': this.projection.Id
            }
        });
    }

    onProjectionTileClick() {
        fireEvent(this.pageRef, EVENT_PROJECTION_CLICKED, this.projection);
    }
}