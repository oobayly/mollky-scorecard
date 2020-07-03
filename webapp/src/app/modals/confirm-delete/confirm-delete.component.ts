import { Component, Input } from "@angular/core";

import { MDBModalRef } from "angular-bootstrap-md";

@Component({
  selector: "app-confirm-delete",
  templateUrl: "./confirm-delete.component.html",
  styleUrls: ["./confirm-delete.component.scss"],
})
export class ConfirmDeleteComponent {
  @Input()
  public message: string;

  public response = false;

  public constructor(
    private modal: MDBModalRef
  ) {
  }

  public hide(response: boolean): void {
    this.response = response;
    this.modal.hide();
  }
}
