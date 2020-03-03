global with sharing class FN_ProjectModel {
    @AuraEnabled public FN_Project__c project { get; private set; }
    @AuraEnabled public List<FN_Project__c> features { get; private set; }

    public FN_ProjectModel(FN_Project__c sheet, List<FN_Project__c> featureList) {
        this.project = sheet;
        this.features = featureList;
    }
}
