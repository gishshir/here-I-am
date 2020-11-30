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

  clearTrajet: boolean = true;
  trajetdays: number = 15;
  alerteMiseRelation: boolean = true;
  alerteStartTrajet: boolean = true;

  response: Message;

  constructor(private optionService: OptionsService) { }

  ngOnInit(): void {

    let listOptions = null;
    this.optionService.getListOfOptions({

      onGetList: (list: Array<Option>) => this.initOptions(list),
      onError: (e: Message) => console.log('errors')

    }
    )
  }

  private initOptions(listOptions: Array<Option>) {
    console.log("initOptions");

    // clear trajet
    let optClearTrajet = listOptions.find((o: Option) => o.name == OptionEnum.clearTrajet);
    let nbDays = Number(optClearTrajet.value);
    if (nbDays >= 0) {
      this.clearTrajet = true;
      this.trajetdays = nbDays;
    } else {
      this.clearTrajet = false;
      this.trajetdays = 15;
    }

    // alerte mise en relation
    let optAlerteMiseEnRelation = listOptions.find((o: Option) => o.name == OptionEnum.alerteMiseRelation);
    this.alerteMiseRelation = optAlerteMiseEnRelation.value == "true";

    // alerte start trajet
    let optAlerteStartTrajet = listOptions.find((o: Option) => o.name == OptionEnum.alerteStartTrajet);
    this.alerteStartTrajet = optAlerteStartTrajet.value == "true";


  }



  onAlerteMiseRelationChange($event): void {

    console.log("onAlerteMiseRelationChange() " + $event.checked);
    this.enregistrerOption(new Option(OptionEnum.alerteMiseRelation, this.alerteMiseRelation ? "true" : "false"));
  }

  onAllerteStartTrajetChange($event): void {

    console.log("onAllerteStartTrajetChange() " + $event.checked);
    this.enregistrerOption(new Option(OptionEnum.alerteMiseRelation, this.alerteStartTrajet ? "true" : "false"));
  }

  onTrajetDaysChange($event): void {
    console.log("onTrajetDaysChange() " + this.trajetdays);
    this.enregistrerClearTrajetChange();
  }
  onClearTrajetChange($event): void {

    console.log("onClearTrajetChange() " + $event.checked);
    this.enregistrerClearTrajetChange();
  }

  private enregistrerClearTrajetChange(): void {

    let nbDays: string = this.clearTrajet ? this.trajetdays + '' : "-1";
    this.enregistrerOption(new Option(OptionEnum.clearTrajet, nbDays));
  }

  private enregistrerOption(option: Option): void {

    this.optionService.modifyOption(option, {

      onError: (e: Message) => this.response = e,
      onMessage: (m: Message) => this.response = m
    }
    );
  }

}
