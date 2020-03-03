import { LightningElement, api } from 'lwc';

export default class ProjectFeature extends LightningElement {
    @api feature;
    @api columns;
}