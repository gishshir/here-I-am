export class Option {

    name: OptionEnum;
    value: string;

    constructor(name: OptionEnum, value: string) {
        this.name = name;
        this.value = value;
    }
}

export enum OptionEnum {

    clearTrajet, alerteMiseRelation, alerteStartTrajet
}
