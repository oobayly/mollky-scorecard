import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { Observable } from "rxjs";

import { StorageService } from "../../core/services/storage.service";
import { ModalHelperService } from "src/app/core/services/modal-helper.service";
import { Player } from "src/app/core/model";
import { PlayersListComponent } from "src/app/shared/players-list/players-list.component";

@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.scss"],
})
export class PlayersComponent implements AfterViewInit {
  @ViewChild("playerList")
  public playerList: PlayersListComponent;

  public checkedPlayers$: Observable<Player[]>;

  public constructor(
    private modal: ModalHelperService,
    private storage: StorageService
  ) {
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkedPlayers$ = this.playerList.checkedPlayers$;
    });
  }

  public async onAddPlayerClick(): Promise<void> {
    await this.modal.showEditPlayer();
  }

  public async onScanPlayerClick(): Promise<void> {
    const resp = await this.modal.showScanner("Scan a Player QRCode");

    if (resp?.type !== "player") {
      return;
    }

    await this.storage.importPlayer(resp.id);
  }
}
