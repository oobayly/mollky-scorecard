import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

import { MDBModalRef } from "angular-bootstrap-md";
import { Player } from "src/app/core/model";
import { StorageService } from "src/app/core/services/storage.service";

@Component({
  selector: "app-edit-player",
  templateUrl: "./edit-player.component.html",
  styleUrls: ["./edit-player.component.scss"],
})
export class EditPlayerComponent implements AfterViewInit {
  private _player: Player;

  public isEditing: boolean;

  public get player(): Player {
    return this._player;
  }

  @ViewChild("playerName")
  public playerName: ElementRef;

  public constructor(
    private modalRef: MDBModalRef,
    private storage: StorageService
  ) {
    this.setPlayer({
      id: null,
      maxMisses: 3,
      name: "",
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
    this.player.name = this.player.name.trim();

    if (!this.player.name) {
      return;
    }

    this.storage.updatePlayer(this.player);

    this.hide();
  }

  public setPlayer(player: Player): void {
    this.isEditing = !!player.id;
    this._player = Object.assign({}, player);
  }
}
