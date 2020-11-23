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

  log(caller: string, message: string) {
    this.logWithLevel(JournalLevel.DEBUG, caller, message);
  }

  logInfo(caller: string, message: string) {
    this.logWithLevel(JournalLevel.INFO, caller, message);
  }
  logError(caller: string, message: string) {
    this.logWithLevel(JournalLevel.ERROR, caller, message);
  }

  private logWithLevel(level: JournalLevel, caller: string, message: string) {

    console.log(message);

    if (this.activeJournal && message) {
      let journal: Journal = new Journal();
      journal.level = level;
      journal.message = message;
      journal.timestampSec = this.tools.getNowTimestampEnSec();
      journal.caller = caller;

      this.localStorage.storeLogLine(journal);
    }
  }


}
