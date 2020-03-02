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
            SELECT Id, Name, Description__c, RateOfWork__c, Team__c, ProjectedTime__c, ProjectedTimeWithBuffer__c, Buffer__c,
                Team__r.Name
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
                SELECT Id, Name, Description__c, RateOfWork__c, Team__c, ProjectedTime__c, ProjectedTimeWithBuffer__c, Buffer__c
                    , Team__r.Name
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
    public static FN_Project__c getProjectFeaturesAndLines(string projectId){
        if(String.isEmpty(projectId)) {
            return null;
        }

        FN_Project__c projectSheet = [
            SELECT Id, Name, RecordType.Name, Buffer__c, Description__c, ProjectedTime__c, ProjectedTimeWithBuffer__c, RateOfWork__c, Team__r.Name,
                (SELECT Id, Name, RecordType.Name, Buffer__c, Description__c, ProjectedTime__c, ProjectedTimeWithBuffer__c, RateOfWork__c
                    FROM Features__r
                ),
                (SELECT Id, Name FROM ProjectLines__r ORDER BY ItemOrder__c)
            FROM FN_Project__c
            WHERE Id = :projectId
        ][0];
        system.debug('project Sheet');
        system.debug(projectSheet);

        // get a list of feature IDs in order to get the related line items.
        Map<Id, integer> featureIdsMap = new Map<Id, integer>();
        for(Integer idx = 0; idx < projectSheet.Features__r.size(); idx++) {
            featureIdsMap.put(projectSheet.Features__r[idx].Id, idx);
        }

        // get the realted line items
        List<FN_ProjectLine__c> featureLines = [
            SELECT ID, Name, Project__c, ItemOrder__c, WorkItemName__c, WorkItemSize__c, WorkItemStatus__c, WorkItem__c, FiftySize__c, NinetySize__c, Details__c
            FROM FN_ProjectLine__c
            WHERE ID in :featureIdsMap.KeySet()
            ORDER BY Project__c, ItemOrder__c
        ];

        // loop the feature lines and add them to the lines collection of the related feature using the previously populated map to find the correct index
        for(FN_ProjectLine__c line : featureLines) {
            projectSheet.Features__r[featureIdsMap.get(line.Project__c)].ProjectLines__r.add(line);
        }

        return projectSheet;
    }
}
