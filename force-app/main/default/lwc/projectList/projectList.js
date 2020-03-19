import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import searchProjectSheets from '@salesforce/apex/FN_ProjectController.searchProjectSheets';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { loadStyle } from 'lightning/platformResourceLoader';
import { fireEvent } from 'c/pubsub';
import { EVENT_PROJECT_LIST_CHANGED } from 'c/constants';

export default class ProjectList extends LightningElement {
    @track projects;
    @track searchTerm = '';
    @wire(CurrentPageReference) pageRef;
    @wire(searchProjectSheets, { searchTerm: '$searchTerm' })
    loadProjects(result) {
        this.projects = result;
        fireEvent(this.pageRef, EVENT_PROJECT_LIST_CHANGED, result);
    }

    connectedCallback() {
        loadStyle(this, projectResources + '/style.css');
        loadStyle(this, projectResources + '/styles/project-tile.css');
    }

    onSearchTermChanged(event) {
        window.clearTimeout(this.delayTimeout);
        const searchTerm = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchTerm = searchTerm;
        }, 300);
    }

    get hasResults() {
        return (this.projects.data.length > 0);
    }
}