export class ProjectItem {
    id;
    name;
    description;
    fiftySize;
    ninetySize;
    workItemName;
    workItemSize;
    workItemStatus;
    workItemId;
    itemOrder;
}

export class Project {
    id;
    name;
    description;
    projectedTime;
    projectedTimeWithBuffer;
    rateOfWork;
    teamName;
    features;
    projectItems;
}

export class ProjectFeature extends Project { 
    featureOrder;
    project;
    projectItems;
}

export class Result {
    data;
    error;
}