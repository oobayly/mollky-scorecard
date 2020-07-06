import { BadgeModule, BreadcrumbModule, ButtonsModule, IconsModule, InputsModule } from "angular-bootstrap-md";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { PlayersListComponent } from "./players-list/players-list.component";
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
  declarations: [PlayersListComponent],
  imports: [
    CommonModule,
    FormsModule,
    // MDB
    BadgeModule,
    BreadcrumbModule,
    ButtonsModule,
    IconsModule,
    InputsModule,
    // Other
    QRCodeModule,
  ],
  exports: [
    FormsModule,
    // MDB
    BadgeModule,
    BreadcrumbModule,
    ButtonsModule,
    IconsModule,
    InputsModule,
    // Components
    PlayersListComponent,
    // Other
    QRCodeModule,
  ],
})
export class SharedModule { }
