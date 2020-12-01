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

  clearTrajet: boolean;
  trajetdays: number;
  alerteMiseRelation: boolean;
  alerteStartTrajet: boolean;

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
    let optClearTrajet = listOptions.find((o: Option) => o.name == OptionEnum.clearTrajet);
    this.clearTrajet = optClearTrajet.checked;
    this.trajetdays = Number(optClearTrajet.value);

    // alerte mise en relation
    let optAlerteMiseEnRelation = listOptions.find((o: Option) => o.name == OptionEnum.alerteMiseRelation);
    this.alerteMiseRelation = optAlerteMiseEnRelation.checked;

    // alerte start trajet
    let optAlerteStartTrajet = listOptions.find((o: Option) => o.name == OptionEnum.alerteStartTrajet);
    this.alerteStartTrajet = optAlerteStartTrajet.checked;


  }



  onAlerteMiseRelationChange($event): void {

    console.log("onAlerteMiseRelationChange() " + $event.checked);
    this.enregistrerOption(new Option(OptionEnum.alerteMiseRelation, this.alerteMiseRelation));
  }

  onAllerteStartTrajetChange($event): void {

    console.log("onAllerteStartTrajetChange() " + $event.checked);
    this.enregistrerOption(new Option(OptionEnum.alerteStartTrajet, this.alerteStartTrajet));
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

    let nbDays: string = this.trajetdays + '';
    this.enregistrerOption(new Option(OptionEnum.clearTrajet, this.clearTrajet, nbDays));
  }

  private enregistrerOption(option: Option): void {

    this.optionService.modifyOption(option, {

      onError: (e: Message) => this.response = e,
      onMessage: (m: Message) => this.response = m
    }
    );
  }

}
