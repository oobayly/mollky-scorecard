import { ConfirmDeleteComponent } from "../../modals/confirm-delete/confirm-delete.component";
import { EditPlayerComponent } from "../../modals/edit-player/edit-player.component";
import { Injectable } from "@angular/core";
import { MDBModalService } from "angular-bootstrap-md";
import { Player } from "../model";

@Injectable({
  providedIn: "root",
})
export class ModalHelperService {
  constructor(
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
}
