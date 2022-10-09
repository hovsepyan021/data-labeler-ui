import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {AdminRoutingModule} from "./admin-routing.module";
import {AdminPage} from "./admin.page";
import {DataService} from "../services/data.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRoutingModule
  ],
  declarations: [AdminPage],
  providers: [DataService]
})
export class AdminPageModule {}
