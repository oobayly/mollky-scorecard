import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MDBModalRef } from "angular-bootstrap-md";
import { Player } from "src/app/core/model";
import { StorageService } from "src/app/core/services/storage.service";

@Component({
  selector: "app-edit-player",
  templateUrl: "./edit-player.component.html",
  styleUrls: ["./edit-player.component.scss"],
})
export class EditPlayerComponent implements AfterViewInit {
  public get isEditing(): boolean {
    return !!this.playerId;
  }

  public playerForm: FormGroup;

  private get playerId(): string {
    return this.playerForm.controls["id"].value;
  }

  @ViewChild("playerName")
  public playerName: ElementRef;

  public constructor(
    private formBuilder: FormBuilder,
    private modalRef: MDBModalRef,
    private storage: StorageService
  ) {
    this.playerForm = this.formBuilder.group({
      "id": [null],
      "maxMisses": [3, [Validators.required, Validators.min(1), Validators.max(99)]],
      "name": ["", [Validators.required]],
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.playerName.nativeElement.focus();
    })
  }

  public hide(): void {
    this.modalRef.hide();
  }

  public onSaveClick(_e: Event): void {
    if (!this.playerForm.valid) {
      return;
    }

    const player = Object.assign({}, this.playerForm.value);

    this.storage.updatePlayer(player);

    this.hide();
  }

  public setPlayer(player: Player): void {
    this.playerForm.setValue(player);
  }
}
