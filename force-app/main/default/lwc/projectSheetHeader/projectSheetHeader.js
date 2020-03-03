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
        console.log('header component');
        console.log(this.project);
        this.title = `${this.project.name} - Features & Items`;
        console.log(`title: ${this.title}`);
        console.log(this.appResources);
    }
}