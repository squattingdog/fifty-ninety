// EVENTS
export const EVENT_PROJECTION_CLICKED = 'projectionClicked';
export const EVENT_PROJECTION_LIST_CHANGED = 'projectionListChanged';
export const EVENT_PROJECTION_CREATED = 'projectionCreated';
export const EVENT_PROJECTION_FEATURE_CREATED = 'projectionFeatureCreated';

// datatable events
export const DT_EVENT_CREATE_WORK_ITEM = 'createWorkItem';

// field values
export const WORK_TYPE_FNE = 'F&E';
export const WORK_TYPE_KLO = 'KLO';
export const WORK_TYPE_STEER_CO = 'SteerCo';
export const STATUS_PLANNED = 'Planned';
export const STATUS_IN_PROGRESS = 'In Progress';
export const STATUS_ON_HOLD = 'On Hold';
export const STATUS_COMPLETE = 'Complete';

// style sheets
export const CSS_GENERIC = '/style.css';
export const CSS_PROJECTION_FEATURE = '/styles/projection-feature.css';
export const CSS_PROJECTION_TILE = '/styles/projection-tile.css';

// css classes
export const CSS_PROJECTION_STATUS_PLANNED = 'projection-status_planned';
export const CSS_PROJECTION_STATUS_ON_HOLD = 'projection-status_on-hold';
export const CSS_PROJECTION_STATUS_IN_PROGRESS = 'projection-status_in-progress';
export const CSS_PROJECTION_STATUS_COMPLETE = 'projection-status_complete';

// icons
export const ICON_PAGE = 'img/agile.svg#page-icon';
export const ICON_FNE = 'img/f-n-e.svg#f_n_e';
export const ICON_KLO = 'img/klo.svg#klo';
export const ICON_STEER_CO = 'img/steerco.svg#steerco';

export const PROJECTION_DETAIL_SUMMARY_COLUMNS = [
    { label: 'Work Rate', fieldName: 'rateOfWork', type: 'number'},
    { label: 'Projected Duration', fieldName: 'projectedDuration', type: 'number' },
    { label: 'Buffer', fieldName: 'buffer', type: 'number' },
    { label: 'Projected Duration w/Buffer', fieldName: 'projectedDurationWithBuffer', type: 'number' }
];

export const PROJECTION_DETAIL_SUMMARY_COLUMNS_ORG = [
    { label: 'Work Rate', fieldName: 'RateOfWork__c', type: 'number', cellAttributes: { alignment: 'center' } },
    { label: 'Projected Duration', fieldName: 'ProjectedDuration__c', type: 'number', cellAttributes: { alignment: 'center' } },
    { label: 'Buffer', fieldName: 'Buffer__c', type: 'number', cellAttributes: { alignment: 'center' } },
    { label: 'Projected Duration w/Buffer', fieldName: 'ProjectedDurationWithBuffer__c', type: 'number', cellAttributes: { alignment: 'center' } }
];