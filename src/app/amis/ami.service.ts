import { Injectable } from '@angular/core';
import { AMIS } from './mock-amis';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class AmiService {

  constructor(private logger:LoggerService) { }

  getListeAmis() {
    this.logger.log ("getListeAmis()");
    return AMIS;
  }
}
