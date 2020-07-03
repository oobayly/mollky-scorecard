import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { EditPlayerComponent } from "./edit-player/edit-player.component";
import { EditScoreComponent } from "./edit-score/edit-score.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ConfirmDeleteComponent, EditPlayerComponent, EditScoreComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //
    SharedModule,
  ],
  exports: [
    // Components
    ConfirmDeleteComponent,
    EditPlayerComponent,
    EditScoreComponent,
  ],
})
export class ModalsModule { }
