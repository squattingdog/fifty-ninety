// EVENTS
export const EVENT_PROJECT_TEST = 'projectTest';
export const EVENT_PROJECT_CLICKED = 'projectClicked';
export const EVENT_PROJECT_LIST_CHANGED = 'projectListChanged';
export const EVENT_PROJECT_FEATURE_CREATED = 'projectFeatureCreated';

// datatable events
export const DT_EVENT_CREATE_WORK_ITEM = 'createWorkItem';

// FIELDS
export const PROJECT_LINE_COLUMNS = [
    { label: 'Name', fieldName: 'name', initialWidth: 350, editable: true, sortable: false },
    { label: 'Description', fieldName: 'description', initialWidth: 575, editable: true, sortable: false },
    { label: '50-Size', fieldName: 'fiftySize', type: 'number', editable: true, sortable: false, cellAttributes: {alignment: 'left'} },
    { label: '90-Size', fieldName: 'ninetySize', type: 'number', editable: true, sortable: false, cellAttributes: {alignment: 'left'} },
    { label: 'Work Item', fieldName: 'workItemName', type: 'text', sortable: false },
    { label: 'Work Size', fieldName: 'workItemSize', type: 'number', sortable: false, cellAttributes: {alignment: 'left'} },
    { label: 'Work Status', fieldName: 'workItemStatus', type: 'text', sortable: false },
    { type: 'action', typeAttributes: { rowActions: [
        { label: 'Create Work Item', name: DT_EVENT_CREATE_WORK_ITEM }
    ]}}
];

export const PROJECT_DETAIL_SUMMARY_COLUMNS = [
    { label: 'Work Rate', fieldName: 'rateOfWork', type: 'number'},
    { label: 'Projected Duration', fieldName: 'projectedDuration', type: 'number' },
    { label: 'Buffer', fieldName: 'buffer', type: 'number' },
    { label: 'Projected Duration w/Buffer', fieldName: 'projectedDurationWithBuffer', type: 'number' }
];

export const PROJECT_DETAIL_SUMMARY_COLUMNS_ORG = [
    { label: 'Work Rate', fieldName: 'RateOfWork__c', type: 'number', cellAttributes: { alignment: 'center' } },
    { label: 'Projected Duration', fieldName: 'ProjectedDuration__c', type: 'number', cellAttributes: { alignment: 'center' } },
    { label: 'Buffer', fieldName: 'Buffer__c', type: 'number', cellAttributes: { alignment: 'center' } },
    { label: 'Projected Duration w/Buffer', fieldName: 'ProjectedDurationWithBuffer__c', type: 'number', cellAttributes: { alignment: 'center' } }
];