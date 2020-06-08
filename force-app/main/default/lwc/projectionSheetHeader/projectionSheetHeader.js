/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import projectionResources from '@salesforce/resourceUrl/fifty_ninety';

export default class ProjectionSheetHeader extends LightningElement {
    @api projection;
    @track title;
    appResources = {
        pageIcon: `${projectionResources}/img/agile.svg#page-icon`
    };

    connectedCallback() {
        this.title = `${this.projection.name} - Features & Items`;
    }
}