import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {HolidaysRoutingModule} from "./holidays-routing.module";
import {HolidaysPage} from "./holidays.page";
import {DataService} from "../services/data.service";
import {Find_popup} from "./find_popup/find_popup";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidaysRoutingModule
  ],
  declarations: [HolidaysPage, Find_popup],
  providers: [DataService]
})
export class HolidaysPageModule {}
