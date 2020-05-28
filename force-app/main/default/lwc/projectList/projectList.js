import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import searchProjectSheets from '@salesforce/apex/FN_ProjectController.searchProjectSheets';
import projectResources from '@salesforce/resourceUrl/fifty_ninety';
import { loadStyle } from 'lightning/platformResourceLoader';
import { fireEvent, registerListener } from 'c/pubsub';
import { EVENT_PROJECT_LIST_CHANGED, EVENT_PROJECT_CREATED } from 'c/constants';

export default class ProjectList extends LightningElement {
    @track projects;
    @track searchTerm = '';
    @track errorMessage = '';
    @wire(CurrentPageReference) pageRef;
    @wire(searchProjectSheets, { searchTerm: '$searchTerm' })
    loadProjects(result) {
        console.log(result.data);
        this.projects = result;
        fireEvent(this.pageRef, EVENT_PROJECT_LIST_CHANGED, result);
    }

    connectedCallback() {
        loadStyle(this, projectResources + '/style.css');
        loadStyle(this, projectResources + '/styles/project-tile.css');
        registerListener(EVENT_PROJECT_CREATED, this.onNewProjectAdded, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    onNewProjectAdded(project) {
        // the project object is so different from the collection of projects in this.projects,
        //  that I opted to just pull all the data again vs. making/populating a model every time. 
        //  It may be better to use the model, but that can be an enhancement.
        console.log('projectList::onNewProjectAdded');
        searchProjectSheets({ searchTerm: this.searchTerm })
        .then(result =>{
            this.projects = result;
        }).catch(err => {
            // handle this condition
            this.errorMessage = err.message;
        });
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