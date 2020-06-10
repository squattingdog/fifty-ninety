import FIELD_DETAILS from '@salesforce/schema/FN_ProjectionLine__c.Details__c';
import FIELD_FIFTY_SIZE from '@salesforce/schema/FN_ProjectionLine__c.FiftySize__c';
import FIELD_ID from '@salesforce/schema/FN_ProjectionLine__c.Id';
import FIELD_ITEM_ORDER from '@salesforce/schema/FN_ProjectionLine__c.ItemOrder__c';
import FIELD_NAME from '@salesforce/schema/FN_ProjectionLine__c.Name';
import FIELD_NINETY_SIZE from '@salesforce/schema/FN_ProjectionLine__c.NinetySize__c';
import FIELD_PROJECTION from '@salesforce/schema/FN_ProjectionLine__c.Projection__c';
import FIELD_WORK_ITEM from '@salesforce/schema/FN_ProjectionLine__c.WorkItem__c';


export default class FeatureItemMapper {

    static fromProjectionItem(projectionItem) {
        console.log(`projectionItem to map: ${JSON.stringify(projectionItem, null, 2)}`);
        const projectionLine = {};
        if(projectionItem.description) {
            projectionLine[FIELD_DETAILS.fieldApiName] = projectionItem.description;
        }
        if(projectionItem.fiftySize) {
            projectionLine[FIELD_FIFTY_SIZE.fieldApiName] = projectionItem.fiftySize;
        }
        if(projectionItem.id) {
            projectionLine[FIELD_ID.fieldApiName] = projectionItem.id;
        }
        if(projectionItem.itemOrder) {
            projectionLine[FIELD_ITEM_ORDER.fieldApiName] = projectionItem.itemOrder;
        }
        if(projectionItem.name) {
            projectionLine[FIELD_NAME.fieldApiName] = projectionItem.name;
        }
        if(projectionItem.ninetySize) {
            projectionLine[FIELD_NINETY_SIZE.fieldApiName] = projectionItem.ninetySize;
        }
        if(projectionItem.projectionId) {
            projectionLine[FIELD_PROJECTION.fieldApiName] = projectionItem.projectionId;
        }
        if(projectionItem.workItemId) {
            projectionLine[FIELD_WORK_ITEM.fieldApiName] = projectionItem.workItemId;
        }

        return projectionLine;
    }

    static toProjectionItem(fnProjectionLine) {
        
    }
}
