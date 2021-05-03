import {NgModule} from '@angular/core'
import {Router, RouterModule, Routes} from '@angular/router'
import {CommonModule} from '@angular/common'
import { HttpClientModule } from '@angular/common/http';
import {AddDeviceComponent} from './add-device/add-device.component'
import {DeviceDetailComponent} from './device-detail/device-detail.component'
import {DeviceListComponent} from './device-list/device-list.component'
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms'
import {NgSelectModule} from '@ng-select/ng-select'


const routes:Routes=[
    {
        path: 'add', 
        component:AddDeviceComponent
    },
    {
        path: 'edit/:deviceID', 
        component:AddDeviceComponent
    },
    {
        path: 'list', 
        component:DeviceListComponent
    },
    {
        path: 'detail',
        component:DeviceDetailComponent
    }
]

@NgModule({
    declarations:[
        AddDeviceComponent,
        DeviceDetailComponent,
        DeviceListComponent
    ],
    imports:[
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]


})
export class DeviceModule{ }