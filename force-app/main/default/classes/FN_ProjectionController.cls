public class FN_ProjectionController {

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
     * returns a list of all projections for the record type name 'sheet'
     * 
     * Returns:
     *  FN_Projection__c[] - an array of Fifty Ninety Projections
     */
    @AuraEnabled(Cacheable=true)
    public static FN_Projection__c[] getAllProjectionSheets() {
        return [
            SELECT Id, Name, Description__c, RateOfWork__c, Team__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, Buffer__c,
                Team__r.Name, Status__c, WorkType__c, Epic__r.Name, Epic__r.Id
            FROM FN_Projection__c 
            WHERE RecordType.Name = 'Sheet' ORDER BY Name
        ];
    }

    /**
     * returns a list of projections with a record type of 'sheet' where the name is like the provided search term
     * Input Params: 
     *  String searchTerm - the string used to match when searching
     * 
     * Returns:
     *  FN_Projection__c[] - an arry of Projections
     */
    @AuraEnabled(Cacheable=true)
    public static FN_Projection__c[] searchProjectionSheets(String searchTerm) {       
        searchTerm = searchTerm.trim();

        // return all projections if searchTerm is null/empty
        if (String.isEmpty(searchTerm)) {
            return getAllProjectionSheets();
            
        } else {
            searchTerm = '%' + searchTerm + '%';
            return [
                SELECT Id, Name, Description__c, RateOfWork__c, Team__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, Buffer__c,
                    Team__r.Name, Status__c, WorkType__c, Epic__r.Name, Epic__r.Id
                FROM FN_Projection__c 
                WHERE RecordType.Name = 'Sheet' AND Name LIKE :searchTerm ORDER BY Name LIMIT 50
            ];
        }
    }

    /**
     * returns a list of projection line items for the given projection id
     * 
     * Input Params: 
     *  String projectionId = the projection id used to filter the projection line items.
     * 
     * Returns:
     *  FN_ProjectionLine__c[] - an array of projection line items.
     */
    @AuraEnabled(Cacheable=false)
    public static FN_ProjectionModel getProjectionFeaturesAndLines(string projectionId){
        if(String.isEmpty(projectionId)) {
            return null;
        }

        FN_Projection__c projection = [
            SELECT Id, Name, RecordType.Name, Buffer__c, Description__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, 
            RateOfWork__c, FeatureOrder__c, Team__r.Name, Epic__r.Name, Epic__r.Id, ProductTag__c,
                (SELECT Id, Name, Projection__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, WorkItem__c, FiftySize__c, NinetySize__c, Details__c
                    FROM ProjectionLines__r
                    ORDER BY ItemOrder__c
                )
            FROM FN_Projection__c
            WHERE Id = :projectionId
        ][0];

        // get the related features with line items
        List<FN_Projection__c> featureLines = [
            SELECT Id, Name, RecordType.Name, Buffer__c, Description__c, ProjectedDuration__c, ProjectedDurationWithBuffer__c, RateOfWork__c, FeatureOrder__c, Epic__r.Name, Epic__r.Id,
                (SELECT ID, Name, Projection__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, WorkItem__c, FiftySize__c, NinetySize__c, Details__c
                    FROM ProjectionLines__r
                    ORDER BY ItemOrder__c
                )
            FROM FN_Projection__c
            WHERE ProjectionSheet__c = :projection.Id
            ORDER BY FeatureOrder__c
        ];
        
        FN_ProjectionModel projectionModel = new FN_ProjectionModel(projection, featureLines);
        return projectionModel;
    }

    /**
     * Creates a new work record and updates the projection line with the newly created work item's ID.
     * 
     * Input Params:
     *  string workRecordTypeId: the record type used to create the work item
     *  string productTagId: the product tag used to create the work item
     *  string projectionLineId: the related projection line for the work item
     *  string name: used to set the subject of the work item
     *  string description: used to set the details of the work item
     *  string epicId: the epic to which the new work item is related
     *  string teamId: the team to which the new work item is related
     * 
     * Returns:
     *  agf__ADM_Work__c: the newly created work item
     */
    @AuraEnabled
    public static FN_ProjectionLine__c createWorkItem(string workRecordTypeId, string productTagId, string projectionLineId, 
                                                    string name, string description, string epicId, string teamId) { 
        agf__ADM_Work__c work = new agf__ADM_Work__c(
            RecordTypeId = workRecordTypeId,
            agf__Product_Tag__c = productTagId,
            agf__Subject__c = name,
            agf__Details__c = description,
            agf__Scrum_Team__c = teamId,
            agf__Epic__c = epicId);
        

        INSERT work;

        FN_ProjectionLine__c line = new FN_ProjectionLine__c(
            Id = projectionLineId,
            WorkItem__c = work.Id
        );
        
        UPDATE line;

        return [SELECT ID, Name, Projection__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, 
                        WorkItem__c, FiftySize__c, NinetySize__c, Details__c
            FROM FN_ProjectionLine__c
            WHERE ID = :projectionLineId
        ];
    }
}