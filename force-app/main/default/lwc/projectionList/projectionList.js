import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import searchProjectionSheets from '@salesforce/apex/FN_ProjectionController.searchProjectionSheets';
import projectionResources from '@salesforce/resourceUrl/fifty_ninety';
import { loadStyle } from 'lightning/platformResourceLoader';
import { fireEvent, registerListener } from 'c/pubsub';
import { EVENT_PROJECTION_LIST_CHANGED, EVENT_PROJECTION_CREATED, CSS_GENERIC, CSS_PROJECTION_TILE } from 'c/constants';

export default class ProjectionList extends LightningElement {
    @track projections;
    @track searchTerm = '';
    @track errorMessage = '';
    @wire(CurrentPageReference) pageRef;
    @wire(searchProjectionSheets, { searchTerm: '$searchTerm' })
    loadProjections(result) {
        this.projections = result;
        fireEvent(this.pageRef, EVENT_PROJECTION_LIST_CHANGED, result);
    }

    connectedCallback() {
        loadStyle(this, projectionResources + CSS_GENERIC);
        loadStyle(this, projectionResources + CSS_PROJECTION_TILE);
        registerListener(EVENT_PROJECTION_CREATED, this.onNewProjectionAdded, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    onNewProjectionAdded(projection) {
        // the projection object is so different from the collection of projections in this.projections,
        //  that I opted to just pull all the data again vs. making/populating a model every time. 
        //  It may be better to use the model, but that can be an enhancement.
        console.log('projectionList::onNewProjectionAdded');
        searchProjectionSheets({ searchTerm: this.searchTerm })
        .then(result =>{
            this.projections = result;
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
        return (this.projections.data.length > 0);
    }
}