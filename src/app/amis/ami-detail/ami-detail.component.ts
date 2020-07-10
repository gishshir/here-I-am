import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiState } from '../ami.etat.enum';
import { AmiService } from '../ami.service';
import { Message } from '../../message.type';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-ami-detail',
  templateUrl: './ami-detail.component.html',
  styleUrls: ['./ami-detail.component.css']
})
export class AmiDetailComponent implements OnInit {

  @Input() amiDetail: Ami;
  @Output() eventChangeSuivre = new EventEmitter<Ami>();

  response: Message;

  constructor(private amiService: AmiService) { }

  ngOnInit(): void {
  }

  updateSuivreAmi () {

    this.response = null;

    // mettre à jour la bdd distante
    this.amiDetail.suivre = !this.amiDetail.suivre;

    this.amiService.updateAmi(this.amiDetail).subscribe(
      (resp: Message) => {
        this.response = resp;
        this.eventChangeSuivre.emit(this.amiDetail);
      },
      (error:string) => {
        this.response = {
          message: error,
          error: true
        };
        
      }

    );

  }

}
