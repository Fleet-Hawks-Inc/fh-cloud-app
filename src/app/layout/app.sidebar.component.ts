import { Component, ElementRef, OnInit } from "@angular/core";
import { LayoutService } from "./service/layout.service.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./app.sidebar.component.html",
  styleUrls: ["./app.sidebar.component.scss"],
})
export class AppSidebarComponent implements OnInit {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}

  ngOnInit(): void {}
}
