import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Trajet } from '../trajet.type';
import { ToolsService } from 'src/app/common/tools.service';
import { TrajetService } from '../trajet.service';

@Component({
  selector: 'app-trajet-common',
  templateUrl: './trajet-common.component.html',
  styleUrls: ['./trajet-common.component.scss']
})
export class TrajetCommonComponent implements OnInit {

  @Input()
  trajet: Trajet;

  constructor(private toolsService: ToolsService, private trajetService: TrajetService) {
  }


  getStartDate(): string {

    return this.toolsService.formatDateAndTime(this.trajet.starttime);
  }

  getEndDate(): string {

    if (this.trajet.endtime < 0) {
      return "";
    }
    return this.toolsService.formatDateAndTime(this.trajet.endtime);
  }



  ngOnInit(): void {
  }

}
