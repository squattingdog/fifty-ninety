import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { fireEvent } from 'c/pubsub';
import { EVENT_PROJECT_CLICKED } from 'c/constants';

export default class ProjectTile extends NavigationMixin(LightningElement) {
    @api project;
    @track projectUrl;
    @track recordPageUrl;
    @wire(CurrentPageReference) pageRef; //required by pubsub

    appResources = {
        projectIcon: `${projectResources}/img/f-n-e.svg#f_n_e`
    };

    onOpenProjectClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__projectContainer'
            },
            state: {
                'c__projectId': this.project.Id
            }
        });
    }

    onProjectTileClick() {
        fireEvent(this.pageRef, EVENT_PROJECT_CLICKED, this.project);
    }
}