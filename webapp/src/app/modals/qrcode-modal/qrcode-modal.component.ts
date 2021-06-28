import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { MDBModalRef } from "angular-bootstrap-md";
import { BrowserQRCodeSvgWriter } from "@zxing/browser";

@Component({
  selector: "app-qrcode-modal",
  templateUrl: "./qrcode-modal.component.html",
  styleUrls: ["./qrcode-modal.component.scss"],
})
export class QrcodeModalComponent implements AfterViewInit {
  private _data?: string;

  public title: string;

  public set data(value: string | undefined) {
    this._data = value;

    this.onDataChange();
  }

  public get data(): string | undefined {
    return this._data;
  }

  @ViewChild("qrCode")
  public qrCodeRef?: ElementRef<HTMLElement>;

  public constructor(
    private modalRef: MDBModalRef
  ) {
  }

  public ngAfterViewInit(): void {
    this.onDataChange();
  }

  public hide(): void {
    this.modalRef.hide();
  }

  private onDataChange(): void {
    if (!this.qrCodeRef) {
      return;
    }

    const { data } = this;

    this.qrCodeRef.nativeElement.innerHTML = "";

    if (!data) {
      return;
    }

    const codeWriter = new BrowserQRCodeSvgWriter();
    const size = 300;
    const svg = codeWriter.write(data, size, size);

    // Rather than using the fixed size, add a viewbox, and remove the size attributes
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    this.qrCodeRef.nativeElement.appendChild(svg);
  }
}
