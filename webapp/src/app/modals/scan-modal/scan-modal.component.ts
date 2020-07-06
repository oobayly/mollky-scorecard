import { AfterViewInit, Component } from "@angular/core";
import { BrowserQRCodeReader, Result } from "@zxing/library";

import { MDBModalRef } from "angular-bootstrap-md";
import { ShareObject } from "../../core/model";

@Component({
  selector: "app-scan-modal",
  templateUrl: "./scan-modal.component.html",
  styleUrls: ["./scan-modal.component.scss"],
})
export class ScanModalComponent implements AfterViewInit {
  public canScan = true;

  public error: string;

  public response: ShareObject;

  public title: string;

  public constructor(
    private modalRef: MDBModalRef
  ) {
  }

  public ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then((_response) => {
        // Camera is available.
      })
      .catch((_err) => {
        this.canScan = false;
      });
  }

  private async getImageUrl(file: File): Promise<string> {
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.readAsDataURL(file);

      reader.onerror = (e) => reject(e);
      reader.onload = () => resolve(reader.result as string);
    })

  }

  public hide(): void {
    this.modalRef.hide();
  }

  public onCamerasNotFound(_e: Event): void {
    this.canScan = false;
  }

  public async onFileUpload(e: Event): Promise<void> {
    const { files } = (e.target as HTMLInputElement);

    if (!files.length) {
      return;
    }

    const base64 = await this.getImageUrl(files[0]);

    const reader = new BrowserQRCodeReader();
    let result: Result;

    try {
      result = await reader.decodeFromImageUrl(base64);
    } catch (_e) {
      this.error = "No QRCode could be found in the image."

      return;
    }

    this.response = this.parseQRCode(result.getText());

    if (this.response) {
      this.hide();
    }
  }

  public onScanSuccess(value: string): void {
    this.response = this.parseQRCode(value);

    if (this.response) {
      this.hide();
    }
  }

  private parseQRCode(value: string): ShareObject {
    try {
      return JSON.parse(value);
    } catch (_e) {
      this.error = "The QR Code didn't contain valid data.";

      return;
    }
  }
}
