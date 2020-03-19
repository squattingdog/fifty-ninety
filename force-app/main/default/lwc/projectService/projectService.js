import { WORK_TYPE_FNE, ICON_FNE, WORK_TYPE_KLO, ICON_KLO, WORK_TYPE_PROJECT, ICON_PROJECT, 
    STATUS_COMPLETE, CSS_PROJECT_STATUS_COMPLETE, STATUS_IN_PROGRESS, CSS_PROJECT_STATUS_IN_PROGRESS, 
    STATUS_ON_HOLD, CSS_PROJECT_STATUS_ON_HOLD, STATUS_PLANNED, CSS_PROJECT_STATUS_PLANNED } from 'c/constants';

export default class ProjectService {
    
    static getIconPath(workType) {
        var ret = '';
        switch (workType) {
            case WORK_TYPE_FNE:
                ret = ICON_FNE;
                break;
            case WORK_TYPE_KLO:
                ret = ICON_KLO;
                break;
            case WORK_TYPE_PROJECT:
                ret = ICON_PROJECT;
                break;
        }

        return ret;
    }

    static getStatusCssClass(status) {
        var ret = '';
        switch(status) {
            case STATUS_COMPLETE:
                ret = CSS_PROJECT_STATUS_COMPLETE;
                break;
            case STATUS_IN_PROGRESS:
                ret = CSS_PROJECT_STATUS_IN_PROGRESS;
                break;
            case STATUS_ON_HOLD:
                ret = CSS_PROJECT_STATUS_ON_HOLD;
                break;
            case STATUS_PLANNED:
                ret = CSS_PROJECT_STATUS_PLANNED;
                break;
        }

        return ret;
    }
}