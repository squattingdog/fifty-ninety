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
    buffer;
    projectedDuration;
    projectedDurationWithBuffer;
    rateOfWork;
    teamName;
    teamId;
    features;
    projectItems;
    workType;
    status;
    epicName;
    epicId;
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