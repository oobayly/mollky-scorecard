import { BadgeModule, BreadcrumbModule, ButtonsModule, IconsModule, InputsModule } from "angular-bootstrap-md";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { PlayersListComponent } from "./players-list/players-list.component";

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
  ],
})
export class SharedModule { }
