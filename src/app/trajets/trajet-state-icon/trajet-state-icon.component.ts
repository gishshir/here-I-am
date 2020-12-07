import { Component, OnInit, Input } from '@angular/core';
import { TrajetState } from '../trajet.type';

@Component({
  selector: 'app-trajet-state-icon',
  templateUrl: './trajet-state-icon.component.html',
  styleUrls: ['./trajet-state-icon.component.css']
})
export class TrajetStateIconComponent implements OnInit {

  private _state: TrajetState;
  @Input() set trajetState(state: TrajetState) {
    this._state = state;
    this.onChangeState();
  }
  get trajetState(): TrajetState {
    return this._state;
  }

  description: string = "trajet...";
  iconName: string;
  iconColor: string = "basic";

  constructor() { }

  ngOnInit(): void {
  }

  private onChangeState() {

    switch (this.trajetState) {

      case TrajetState.started: this.description = "Trajet en cours...";
        this.iconName = "speed"; this.iconColor = "accent"; break;
      case TrajetState.ended: this.description = "Trajet terminé.";
        this.iconName = "keyboard_tab"; this.iconColor = "primary"; break;
      case TrajetState.pausing: this.description = "Pause pendant le trajet";
        this.iconName = "pause_circle_outline"; this.iconColor = "warn"; break;

    }
  }

}
