public with sharing class FN_ProjectController {

    @AuraEnabled(Cacheable=true)
    public static agf__ADM_Scrum_Team_Member__c[] searchTeams (String userId) {
       return [
            SELECT agf__Scrum_Team__c,
                    agf__Scrum_Team_Name__c 
            FROM agf__ADM_Scrum_Team_Member__c 
            WHERE agf__Member_Name__c = :userId
        ];
    }

    /**
     * returns a list of all projects
     * 
     * Returns:
     *  FN_Project__c[] - an array of Fifty Ninety Projects
     */
    @AuraEnabled(Cacheable=true)
    public static FN_Project__c[] getAllProjectSheets() {
        return [
            SELECT Id, Name, Description__c, RateOfWork__c, Team__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, Buffer__c,
                Team__r.Name, Status__c, WorkType__c, Epic__r.Name, Epic__r.Id
            FROM FN_Project__c 
            WHERE RecordType.Name = 'Sheet' ORDER BY Name
        ];
    }

    /**
     * returns a list of projects where the name is like the provided search term
     * Input Params: 
     *  String searchTerm - the string used to match when searching
     * 
     * Returns:
     *  FN_Project__c[] - an arry of Fifty Ninety Projects
     */
    @AuraEnabled(Cacheable=true)
    public static FN_Project__c[] searchProjectSheets(String searchTerm) {       
        searchTerm = searchTerm.trim();

        // return all projects if searchTerm is null/empty
        if (String.isEmpty(searchTerm)) {
            return getAllProjectSheets();
            
        } else {
            searchTerm = '%' + searchTerm + '%';
            return [
                SELECT Id, Name, Description__c, RateOfWork__c, Team__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, Buffer__c,
                    Team__r.Name, Status__c, WorkType__c, Epic__r.Name, Epic__r.Id
                FROM FN_Project__c 
                WHERE RecordType.Name = 'Sheet' AND Name LIKE :searchTerm ORDER BY Name LIMIT 50
            ];
        }
    }

    /**
     * returns a list of project line items for the given project id
     * 
     * Input Params: 
     *  String projectId = the project id used to filter the project line items.
     * 
     * Returns:
     *  FN_ProjectLine__c[] - an array of project line items.
     */
    @AuraEnabled(Cacheable=false)
    public static FN_ProjectModel getProjectFeaturesAndLines(string projectId){
        if(String.isEmpty(projectId)) {
            return null;
        }

        FN_Project__c projectSheet = [
            SELECT Id, Name, RecordType.Name, Buffer__c, Description__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, 
            RateOfWork__c, FeatureOrder__c, Team__r.Name, Epic__r.Name, ProductTag__c,
                (SELECT Id, Name, Project__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, WorkItem__c, FiftySize__c, NinetySize__c, Details__c
                    FROM ProjectLines__r
                    ORDER BY ItemOrder__c
                )
            FROM FN_Project__c
            WHERE Id = :projectId
        ][0];

        // get the realted features with line items
        List<FN_Project__c> featureLines = [
            SELECT Id, Name, RecordType.Name, Buffer__c, Description__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, RateOfWork__c, FeatureOrder__c, Epic__r.Name,
                (SELECT ID, Name, Project__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, WorkItem__c, FiftySize__c, NinetySize__c, Details__c
                    FROM ProjectLines__r
                    ORDER BY ItemOrder__c
                )
            FROM FN_Project__c
            WHERE ProjectSheet__c = :projectSheet.Id
            ORDER BY FeatureOrder__c
        ];
        
        FN_ProjectModel projectModel = new FN_ProjectModel(projectSheet, featureLines);
        return projectModel;
    }

    /**
     * Creates a new work record and updates the project line with the newly created work item's ID.
     * 
     * Input Params:
     *  string workRecordTypeId: the record type used to create the work item
     *  string productTagId: the product tag used to create the work item
     *  string projectLineId: the related project line for the work item
     *  string name: used to set the subject of the work item
     *  string description: used to set the details of the work item
     *  string epicId: the epic to which the new work item is related
     *  string teamId: the team to which the new work item is related
     * 
     * Returns:
     *  agf__ADM_Work__c: the newly created work item
     */
    @AuraEnabled
    public static FN_ProjectLine__c createWorkItem(string workRecordTypeId, string productTagId, string projectLineId, string name, string description, string epicId, string teamId) { 
        agf__ADM_Work__c work = new agf__ADM_Work__c(
            RecordTypeId = workRecordTypeId,
            agf__Product_Tag__c = productTagId,
            agf__Subject__c = name,
            agf__Details__c = description,
            agf__Scrum_Team__c = teamId,
            agf__Epic__c = epicId);
        

        INSERT work;

        FN_ProjectLine__c line = new FN_ProjectLine__c(
            Id = projectLineId,
            WorkItem__c = work.Id
        );
        
        UPDATE line;

        return [SELECT ID, Name, Project__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, WorkItem__c, FiftySize__c, NinetySize__c, Details__c
            FROM FN_ProjectLine__c
            WHERE ID = :projectLineId
        ];
    }
}