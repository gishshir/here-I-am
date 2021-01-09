import { Component, OnInit } from '@angular/core';
import { Message } from '../common/message.type';
import { OptionsService } from './options.service';
import { Option, OptionEnum } from './option.type';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  clearOldTrajet: boolean;
  oldtrajetdays: number;
  alerteEventRelation: boolean;
  alerteEventTrajet: boolean;

  response: Message;

  constructor(private optionService: OptionsService) { }

  ngOnInit(): void {

    this.optionService.getListOfOptions({

      onGetList: (list: Array<Option>) => this.initOptions(list),
      onError: (e: Message) => console.log('errors')

    }
    )
  }

  private initOptions(listOptions: Array<Option>) {
    console.log("initOptions");

    // clear trajet
    let optClearOldTrajet = listOptions.find((o: Option) => o.name == OptionEnum.clearOldTrajet);
    this.clearOldTrajet = optClearOldTrajet.checked;
    this.oldtrajetdays = Number(optClearOldTrajet.value);

    // alerte mise en relation
    let optAlerteEventEnRelation = listOptions.find((o: Option) => o.name == OptionEnum.alerteEventRelation);
    this.alerteEventRelation = optAlerteEventEnRelation.checked;

    // alerte start trajet
    let optAlerteEventTrajet = listOptions.find((o: Option) => o.name == OptionEnum.alerteEventTrajet);
    this.alerteEventTrajet = optAlerteEventTrajet.checked;


  }



  onAlerteEventRelationChange($event): void {

    console.log("onAlerteEventRelationChange() " + $event.checked);
    this.enregistrerOption(new Option(OptionEnum.alerteEventRelation, this.alerteEventRelation));
  }

  onAlerteEventTrajetChange($event): void {

    console.log("onAlerteEventTrajetChange() " + $event.checked);
    this.enregistrerOption(new Option(OptionEnum.alerteEventTrajet, this.alerteEventTrajet));
  }

  onOldTrajetDaysChange($event): void {
    console.log("onOldTrajetDaysChange() " + this.oldtrajetdays);
    this.enregistrerClearOldTrajetChange();
  }
  onClearOldTrajetChange($event): void {

    console.log("onClearOldTrajetChange() " + $event.checked);
    this.enregistrerClearOldTrajetChange();
  }

  private enregistrerClearOldTrajetChange(): void {

    let nbDays: string = this.oldtrajetdays + '';
    this.enregistrerOption(new Option(OptionEnum.clearOldTrajet, this.clearOldTrajet, nbDays));
  }

  private enregistrerOption(option: Option): void {

    this.optionService.modifyOption(option, {

      onError: (e: Message) => this.response = e,
      onMessage: (m: Message) => this.response = m
    }
    );
  }

}
