import FIELD_DETAILS from '@salesforce/schema/FN_ProjectionLine__c.Details__c';
import FIELD_FIFTY_SIZE from '@salesforce/schema/FN_ProjectionLine__c.FiftySize__c';
import FIELD_ID from '@salesforce/schema/FN_ProjectionLine__c.Id';
import FIELD_ITEM_ORDER from '@salesforce/schema/FN_ProjectionLine__c.ItemOrder__c';
import FIELD_NAME from '@salesforce/schema/FN_ProjectionLine__c.Name';
import FIELD_NINETY_SIZE from '@salesforce/schema/FN_ProjectionLine__c.NinetySize__c';
import FIELD_PROJECTION from '@salesforce/schema/FN_ProjectionLine__c.Projection__c';
import FIELD_WORK_ITEM from '@salesforce/schema/FN_ProjectionLine__c.WorkItem__c';
import FIELD_WORK_ITEM_NAME from '@salesforce/schema/FN_ProjectionLine__c.WorkItemName__c';
import FIELD_WORK_ITEM_STATUS from '@salesforce/schema/FN_ProjectionLine__c.WorkItemStatus__c';


export default class FeatureItemMapper {

    static fromProjectionItem(projectionItem) {
        const fnProjectionLine = {};
        if(projectionItem.description) {
            fnProjectionLine[FIELD_DETAILS.fieldApiName] = projectionItem.description;
        }
        if(projectionItem.fiftySize) {
            fnProjectionLine[FIELD_FIFTY_SIZE.fieldApiName] = projectionItem.fiftySize;
        }
        if(projectionItem.id) {
            fnProjectionLine[FIELD_ID.fieldApiName] = projectionItem.id;
        }
        if(projectionItem.itemOrder) {
            fnProjectionLine[FIELD_ITEM_ORDER.fieldApiName] = projectionItem.itemOrder;
        }
        if(projectionItem.name) {
            fnProjectionLine[FIELD_NAME.fieldApiName] = projectionItem.name;
        }
        if(projectionItem.ninetySize) {
            fnProjectionLine[FIELD_NINETY_SIZE.fieldApiName] = projectionItem.ninetySize;
        }
        if(projectionItem.projectionId) {
            fnProjectionLine[FIELD_PROJECTION.fieldApiName] = projectionItem.projectionId;
        }
        if(projectionItem.workItemId) {
            fnProjectionLine[FIELD_WORK_ITEM.fieldApiName] = projectionItem.workItemId;
        }

        return fnProjectionLine;
    }

    static toProjectionItem(fnProjectionLine) {
        projectionItem.description = fnProjectionLine[FIELD_DETAILS.fieldApiName];
        projectionItem.fiftySize = fnProjectionLine[FIELD_FIFTY_SIZE.fieldApiName];
        projectionItem.id = fnProjectionLine[FIELD_ID.fieldApiName];
        projectionItem.itemOrder = fnProjectionLine[FIELD_ITEM_ORDER.fieldApiName];
        projectionItem.name = fnProjectionLine[FIELD_NAME.fieldApiName];
        projectionItem.ninetySize = fnProjectionLine[FIELD_NINETY_SIZE.fieldApiName];
        projectionItem.projectionId = fnProjectionLine[FIELD_PROJECTION.fieldApiName];
        projectionItem.workItemId = fnProjectionLine[FIELD_WORK_ITEM.fieldApiName];
        projectionItem.workItemName = fnProjectionLine[FIELD_WORK_ITEM_NAME.fieldApiName];
        projectionItem.workItemStatus = fnProjectionLine[FIELD_WORK_ITEM_STATUS.fieldApiName];
        projectionItem.workItemUrl = `/${fnProjectionLine[FIELD_WORK_ITEM.fieldApiName]}`;
        return projectionItem;
    }
}
