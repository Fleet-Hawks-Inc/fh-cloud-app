import { Injectable } from '@angular/core';

import {BehaviorSubject}    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfAutomationService {
  public missionAnnouncedSource = new BehaviorSubject({});
  public missionAnnounced$ = this.missionAnnouncedSource.asObservable();

 
}
