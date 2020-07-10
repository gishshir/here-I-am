import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Ami } from '../ami.type';
import { AmiState } from '../ami.etat.enum';
import { AmiService } from '../ami.service';

@Component({
  selector: 'app-ami-detail',
  templateUrl: './ami-detail.component.html',
  styleUrls: ['./ami-detail.component.css']
})
export class AmiDetailComponent implements OnInit {

  @Input() amiDetail: Ami;
  @Output() eventChangeSuivre = new EventEmitter<Ami>();

  constructor(private amiService: AmiService) { }

  ngOnInit(): void {
  }

  updateSuivreAmi () {

    // mettre à jour la bdd distante
    this.amiDetail.suivre = !this.amiDetail.suivre;
    this.amiService.updateAmi(this.amiDetail).subscribe((any) => {
      this.eventChangeSuivre.emit(this.amiDetail);
    });

  }

}
