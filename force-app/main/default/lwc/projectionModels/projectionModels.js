import FeatureItemMapper from "c/featureItemMapper";

export class ProjectionItem {
    description;
    fiftySize;
    id;
    itemOrder;
    name;
    ninetySize;
    projectionId;
    workItemName;
    workItemSize;
    workItemStatus;
    workItemId;
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