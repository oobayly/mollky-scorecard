import { Player, PlayerRecord, ShareObject } from "../model";

import { ConfirmDeleteComponent } from "../../modals/confirm-delete/confirm-delete.component";
import { EditPlayerComponent } from "../../modals/edit-player/edit-player.component";
import { EditScoreComponent } from "../../modals/edit-score/edit-score.component";
import { Injectable } from "@angular/core";
import { MDBModalService } from "angular-bootstrap-md";
import { QrcodeModalComponent } from "../../modals/qrcode-modal/qrcode-modal.component";

@Injectable({
  providedIn: "root",
})
export class ModalHelperService {
  public constructor(
    private modal: MDBModalService,
  ) {
  }

  public async showEditPlayer(player?: Player): Promise<void> {
    const ref = this.modal.show(EditPlayerComponent, {
      "class": "modal-dialog-centered",
    });

    const component = ref.content as EditPlayerComponent;
   
    if (player) {
      component.setPlayer(player);
    }

    return new Promise<void>((resolve) => {
      const sub = this.modal.closed.subscribe(() => {
        sub.unsubscribe();

        resolve();
      })
    });
  }

  public async showEditScore(gameId: string, record: PlayerRecord): Promise<void> {
    const ref = this.modal.show(EditScoreComponent, {
      "class": "modal-dialog-centered",
    });

    const component = ref.content as EditScoreComponent;

    component.setPlayerRecord(gameId, record);
 
    return new Promise<void>((resolve) => {
      const sub = this.modal.closed.subscribe(() => {
        sub.unsubscribe();

        resolve();
      })
    });
  }

  public async showDelete(message: string): Promise<boolean> {
    const ref = this.modal.show(ConfirmDeleteComponent, {
      "class": "modal-dialog-centered modal-notify modal-danger",
    });

    const component = ref.content as ConfirmDeleteComponent;

    component.message = message;

    return new Promise<boolean>((resolve) => {
      const sub = this.modal.closed.subscribe(() => {
        sub.unsubscribe();

        resolve(component.response);
      })
    });
  }

  public async showQrCode(title : string, data: string | ShareObject) : Promise<void> {
    const ref = this.modal.show(QrcodeModalComponent, {
      "class": "modal-dialog-centered",
    });

    const component = ref.content as QrcodeModalComponent;

    component.data = (typeof data === "string") ? data : JSON.stringify(data);
    component.title = title;
 
    return new Promise<void>((resolve) => {
      const sub = this.modal.closed.subscribe(() => {
        sub.unsubscribe();

        resolve();
      })
    });
 }
}
