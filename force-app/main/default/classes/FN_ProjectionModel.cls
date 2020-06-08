global with sharing class FN_ProjectionModel {
    @AuraEnabled public FN_Projection__c projection { get; private set; }
    @AuraEnabled public List<FN_Projection__c> features { get; private set; }

    public FN_ProjectionModel(FN_Projection__c projection, List<FN_Projection__c> featureList) {
        this.projection = projection;
        this.features = featureList;
    }
}
