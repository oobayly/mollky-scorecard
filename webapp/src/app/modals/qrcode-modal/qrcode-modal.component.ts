import { Component } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";

@Component({
  selector: "app-qrcode-modal",
  templateUrl: "./qrcode-modal.component.html",
  styleUrls: ["./qrcode-modal.component.scss"],
})
export class QrcodeModalComponent {
  public title: string;

  public data: string;

  public constructor(
    private modalRef: MDBModalRef
  ) {
  }

  public hide(): void {
    this.modalRef.hide();
  }
}
