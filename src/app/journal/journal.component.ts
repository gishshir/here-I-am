import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { NotificationService } from '../common/notification/notification.service';
import { AppStorageService } from '../common/storage.service';
import { ToolsService } from '../common/tools.service';
import { Journal, JournalLevel } from './journal.type';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  selectedValue: string;
  listLines: string;

  get journal_on(): boolean {
    return this.selectedValue == "on";
  }

  constructor(private loggerService: LoggerService, private storageService: AppStorageService,
    private tools: ToolsService) {

    let activateJournal = this.loggerService.isJournalActivated();
    this.selectedValue = activateJournal ? "on" : "off";

    this.refreshJournal();

  }

  ngOnInit(): void {
  }

  onChangeValue(): void {
    this.loggerService.activateJournal(this.journal_on);
  }

  clearJournal(): void {
    this.storageService.clearLogs();
    this.listLines = "";
  }

  refreshJournal(): void {

    this.listLines = "";
    let logs: Array<Journal> = this.storageService.restoreLogs();

    logs.forEach(
      (j: Journal) => this.listLines += "\n" + this.ecrireLine(j)
    );

  }

  private ecrireLine(journal: Journal): string {

    let level: string = JournalLevel[journal.level];
    let date: string = this.tools.formatShortDateAndTime(journal.timestampSec);
    return "[" + level + "] - " + date + " - " + journal.message;
  }

}
