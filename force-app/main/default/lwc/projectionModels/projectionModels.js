export class ProjectionItem {
    id;
    name;
    description;
    fiftySize;
    ninetySize;
    buffer;
    projectionId;
    workItemName;
    workItemSize;
    workItemStatus;
    workItemId;
    itemOrder;
}

export class ProjectionBase {
    id;
    name;
    description;
    buffer;
    projectedDuration;
    projectedDurationWithBuffer;
    rateOfWork;
    teamName;
    teamId;
    projectionItems;
    workType;
    status;
    epicName;
    epicId;
    productTagId;
}
export class Projection extends ProjectionBase {
    features;
}

export class ProjectionFeature extends ProjectionBase { 
    featureOrder;
    projectionId;
    projectionItems;
}

export class Result {
    data;
    error;
}