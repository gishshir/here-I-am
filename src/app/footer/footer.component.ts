import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../common/tools.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private tools: ToolsService) { }

  ngOnInit(): void {
  }

  openTsadeo(): void {
    console.log("open tsadeo!");
    this.tools.openNewWindow("https://www.tsadeo.fr");
  }

}
