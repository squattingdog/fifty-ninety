import { LightningElement, api, track } from 'lwc';

export default class ProjectFeature extends LightningElement {
    @api feature;
    @api columns;
    @track data;

    connectedCallback() {
        this.data = this.feature.projectItems;
    }
}