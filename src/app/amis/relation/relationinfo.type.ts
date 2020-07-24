
export interface RelationInfo {

    id: number;
    etat: RelationState;

    action: RelationAction;
    amiaction: RelationAction;

}

//(none | invitation | acceptee | refusee )
export enum RelationAction {

    none = "none",
    invitation = "invitation",
    acceptee = "acceptee",
    refusee = "refusee"

}

export enum RelationState {

    pending = "pending",
    open = "open",
    closed = "closed"

}
