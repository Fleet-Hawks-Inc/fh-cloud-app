import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent , SidebarComponent} from './components';
import { BaseLayoutComponent} from './layout';
import {RouterModule} from '@angular/router';

const COMPONENTS = [
  HeaderComponent,
  SidebarComponent,
  BaseLayoutComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule,
    RouterModule],
  exports: [ ...COMPONENTS ]
})
export class LayoutModule { }
