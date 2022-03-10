import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AssetTrackerComponent } from "./asset-tracker/asset-tracker.component";
import { VehicleDashCamTrackerComponent } from "./vehicle-dash-cam-tracker/vehicle-dash-cam-tracker.component";




const routes: Routes = [
    {
        path: "asset-tracker",
        component: AssetTrackerComponent,
        data: { title: "Asset Tracking" },
    },

    {
        path: "vehicle-dash-cam-tracker/:deviceSerial",
        component: VehicleDashCamTrackerComponent,
        data: { title: "Realtime Location" },
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrackingRoutingModule { }
