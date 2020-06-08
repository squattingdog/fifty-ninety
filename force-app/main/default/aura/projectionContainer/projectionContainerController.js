({
    onInit: function(component) {
        var pageRef = component.get("v.pageReference");
        var projectionId = pageRef.state.c__projectionId;
        component.set("v.projectionId", projectionId);
    },

    reInit: function (component) {
        var pageRef = component.get("v.pageReference");
        var projectionId = pageRef.state.c__projectionId;
        var oldProjectionId = component.get("v.projectionId");
        if(projectionId != oldProjectionId) {
            component.set("v.projectionId", projectionId);
            $A.get('e.force:refreshView').fire();
        }
    }
})
