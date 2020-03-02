// EVENTS
const EVENT_PROJECT_TEST = 'projectTest';
const EVENT_PROJECT_CLICKED = 'projectClicked';
const EVENT_PROJECT_LIST_CHANGED = 'projectListChanged';

// FIELDS
const PROJECT_LINE_COLUMNS = [
    { label: 'Name', fieldName: 'name', initialWidth: 350 },
    { label: 'Description', fieldName: 'description', initialWidth: 575 },
    { label: '50', fieldName: 'fiftySize', type: 'number' },
    { label: '90', fieldName: 'ninetySize', type: 'number' },
    { label: 'Work Item', fieldName: 'workItemName', type: 'text' },
    { label: 'Work Size', fieldName: 'workItemSize', type: 'number' },
    { label: 'Work Status', fieldName: 'workItemStatus', type: 'text' }
];

export {
    EVENT_PROJECT_TEST,
    EVENT_PROJECT_CLICKED,
    EVENT_PROJECT_LIST_CHANGED,
    PROJECT_LINE_COLUMNS
}