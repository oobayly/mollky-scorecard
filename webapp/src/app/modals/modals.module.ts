import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { ConfirmDeleteComponent } from "./confirm-delete/confirm-delete.component";
import { EditPlayerComponent } from "./edit-player/edit-player.component";
import { EditScoreComponent } from "./edit-score/edit-score.component";
import { NgModule } from "@angular/core";
import { QrcodeModalComponent } from "./qrcode-modal/qrcode-modal.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [ConfirmDeleteComponent, EditPlayerComponent, EditScoreComponent, QrcodeModalComponent],
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
    QrcodeModalComponent,
  ],
})
export class ModalsModule { }
