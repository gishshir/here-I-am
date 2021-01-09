export class Option {

    name: OptionEnum;
    checked: boolean = false;
    value?: string;

    constructor(name: OptionEnum, checked: boolean, value?: string) {
        this.name = name;
        this.checked = checked;
        this.value = value;
    }

}

export enum OptionEnum {

    clearOldTrajet = "clearOldTrajet",
    alerteEventRelation = "alerteEventRelation",
    alerteEventTrajet = "alerteEventTrajet"
}
