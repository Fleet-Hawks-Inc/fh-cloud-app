import { Component, OnInit } from "@angular/core";
import { LayoutService } from "./service/layout.service.service";

@Component({
  selector: "app-footer",
  templateUrl: "./app.footer.component.html",
  styleUrls: ["./app.footer.component.scss"],
})
export class AppFooterComponent implements OnInit {
  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {}
}
