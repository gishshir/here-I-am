import { Component, OnInit } from '@angular/core';
import { LoggerService } from '../common/logger.service';
import { AppStorageService } from '../common/storage.service';
import { ToolsService } from '../common/tools.service';
import { Journal, JournalLevel } from './journal.type';

const LEVEL_PAD = "     ";
const NAME_PAD = "                    ";
@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  selectedValue: string;
  listLines: string;
  title: string = "Journal interne";

  get journal_on(): boolean {
    return this.selectedValue == "on";
  }

  constructor(private loggerService: LoggerService, private storageService: AppStorageService,
    private tools: ToolsService) {

    let activateJournal = this.loggerService.isJournalActivated();
    this.selectedValue = activateJournal ? "on" : "off";
    this.buildTitre();

    this.refreshJournal();

  }

  ngOnInit(): void {
  }

  private buildTitre(): void {

    if (this.journal_on) {
      this.title = "Journal interne actif";
    } else {
      this.title = "Journal interne inactif";
    }
  }

  onChangeValue(): void {
    this.buildTitre();
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

    let level: string = this.tools.pad(LEVEL_PAD, JournalLevel[journal.level], false);
    let date: string = this.tools.formatShortDateAndTime(journal.timestampSec);
    let caller: string = this.tools.pad(NAME_PAD, journal.caller, false);
    return "[" + level + "] " + caller + ": " + date + " - " + journal.message;
  }

}
