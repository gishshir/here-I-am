import { Component, OnInit, Input } from '@angular/core';
import { RelationAction } from '../relationinfo.type';

@Component({
  selector: 'app-action-rel',
  templateUrl: './action-rel.component.html',
  styleUrls: ['./action-rel.component.scss']
})
export class ActionRelComponent implements OnInit {

  @Input() action: RelationAction;

  constructor() { }

  ngOnInit(): void {
  }

  getDescription(): string {

    let description: string = "";
    switch (this.action) {

      case RelationAction.none: description = "Pas de réponse à l'invitation."; break;
      case RelationAction.invitation: description = "Invitation à devenir amis"; break;
      case RelationAction.acceptee: description = "Invitation acceptée"; break;
      case RelationAction.refusee: description = "Invitation refusée"; break;

    }
    return description;
  }

}
