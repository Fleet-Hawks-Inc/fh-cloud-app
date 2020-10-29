import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-program-detail',
  templateUrl: './service-program-detail.component.html',
  styleUrls: ['./service-program-detail.component.css']
})
export class ServiceProgramDetailComponent implements OnInit {
  private programs;
  private vehicles;
  private programID;
  private tasks;
  constructor(
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.programID = this.route.snapshot.params['programID'];
    this.fetchProgramByID();
  }

  fetchProgramByID() {
    this.spinner.show(); // loader init
    this.apiService.getData(`servicePrograms/${this.programID}`).subscribe({
      complete: () => {},
      error: () => {},
      next: (result: any) => {
        console.log(result);
        this.programs = result.Items;
        this.vehicles = this.programs[0]['vehicles'];
        this.tasks = this.programs[0]['serviceScheduleDetails'];
        console.log('progran', this.programs)
        this.spinner.hide(); // loader hide
      },
    });
  }
}
