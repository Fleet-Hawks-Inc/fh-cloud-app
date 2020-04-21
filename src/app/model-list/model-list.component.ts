import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-model-list",
  templateUrl: "./model-list.component.html",
  styleUrls: ["./model-list.component.css"],
})
export class ModelListComponent implements OnInit {
  title = "Models List";
  models = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchModels();
  }

  fetchModels() {
    this.apiService.getData("models").subscribe((result: any) => {
      this.models = result.Items;
    });
  }

  deleteModel(modelID) {
    this.apiService
      .deleteData("models/" + modelID)
      .subscribe((result: any) => {
        this.fetchModels();
      });
  }
}
