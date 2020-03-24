/* eslint-disable no-console */
import { LightningElement, api, track } from 'lwc';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';

export default class ProjectSheetHeader extends LightningElement {
    @api project;
    @track title;
    appResources = {
        pageIcon: `${projectResources}/img/agile.svg#page-icon`
    };

    connectedCallback() {
        this.title = `${this.project.name} - Features & Items`;
    }
}