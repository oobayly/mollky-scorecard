import { AfterViewInit, Component, ViewChild } from "@angular/core";

import { ModalHelperService } from "src/app/core/services/modal-helper.service";
import { Observable } from "rxjs";
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

  public checkedPlayers: Observable<Player[]>;

  constructor(
    private modal: ModalHelperService
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkedPlayers = this.playerList.checkedPlayers;
    });
  }

  public async onAddPlayerClick(): Promise<void> {
    await this.modal.showEditPlayer();
  }
}
