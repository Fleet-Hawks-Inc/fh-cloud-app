import { Component, ElementRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { LayoutService } from "./service/layout.service.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./app.topbar.component.html",
  styleUrls: ["./app.topbar.component.scss"],
})
export class AppTopBarComponent {
  items!: MenuItem[];

  @ViewChild("menubutton") menuButton!: ElementRef;

  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

  @ViewChild("topbarmenu") menu!: ElementRef;

  constructor(public layoutService: LayoutService) {}
}
