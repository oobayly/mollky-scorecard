import { CommonModule } from "@angular/common";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { EditPlayerComponent } from "./edit-player/edit-player.component";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ConfirmDeleteComponent, EditPlayerComponent],
  imports: [
    CommonModule,
    FormsModule,
    //
    SharedModule,
  ],
  exports: [
    // Components
    ConfirmDeleteComponent,
    EditPlayerComponent,
  ],
})
export class ModalsModule { }
