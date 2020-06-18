/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import projectionResources from '@salesforce/resourceUrl/fifty_ninety';
import apexCalculateProjection from '@salesforce/apex/FN_ProjectionController.calculateProjection';
import { ICON_PAGE } from 'c/constants';

export default class ProjectionSheetHeader extends LightningElement {
    @api projection;
    @track title;
    appResources = {
        pageIcon: `${projectionResources}/${ICON_PAGE}`
    };

    connectedCallback() {
        this.title = `${this.projection.name} - Features & Items`;
    }

    onCalculateClicked() {
        console.log(`calculating for id: ${this.projection.id}`);
        apexCalculateProjection({projectionSheetId: this.projection.id})
        .then(() => {
            // refresh page
            console.log('calculation complete');
        })
        .catch(e => {
            console.log(e);
            //show toast error
        });
    }
}