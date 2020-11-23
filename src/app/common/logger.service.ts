import { Injectable } from '@angular/core';
import { Journal, JournalLevel } from '../journal/journal.type';
import { AppStorageService } from './storage.service';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private activeJournal: boolean = false;

  constructor(private localStorage: AppStorageService, private tools: ToolsService) {

  }

  // uniquement appellé et utilisé par journal component
  isJournalActivated(): boolean {
    return this.activeJournal;
  }
  activateJournal(active: boolean): void {
    this.activeJournal = active;
  }
  // ------------------------------------------------

  log(message: string) {
    this.logWithLevel(JournalLevel.DEBUG, message);
  }

  logInfo(message: string) {
    this.logWithLevel(JournalLevel.INFO, message);
  }
  logError(message: string) {
    this.logWithLevel(JournalLevel.ERROR, message);
  }

  private logWithLevel(level: JournalLevel, message: string) {

    console.log(message);

    if (this.activeJournal && message) {
      let journal: Journal = new Journal();
      journal.level = level;
      journal.message = message;
      journal.timestampSec = this.tools.getNowTimestampEnSec();

      this.localStorage.storeLogLine(journal);
    }
  }


}
