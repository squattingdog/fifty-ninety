({
    onInit: function(cmp, evt, helper) {
        var pageRef = cmp.get("v.pageReference");
        var projectId = pageRef.state.c__projectId;
        cmp.set("v.projectId", projectId);
    },

    reInit: function (cmp, evt, helper) {
        var pageRef = cmp.get("v.pageReference");
        var projectId = pageRef.state.c__projectId;
        var oldProjectId = cmp.get("v.projectId");
        if(projectId != oldProjectId) {
            cmp.set("v.projectId", projectId);
            $A.get('e.force:refreshView').fire();
        }
    }
})
