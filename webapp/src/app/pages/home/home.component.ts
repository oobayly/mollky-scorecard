import { Game, Player } from "../../core/model";

import { Component } from "@angular/core";
import { ModalHelperService } from "../../core/services/modal-helper.service";
import { Observable } from "rxjs";
import { StorageService } from "../../core/services/storage.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  public readonly leagueTable: Observable<Player[]>;

  public get openGames(): Observable<Game[]> {
    return this.storage.openGames;
  }

  public constructor(
    private modalHelper: ModalHelperService,
    private storage: StorageService
  ) {
    this.leagueTable = this.storage.players.pipe(
      map((players) => {
        return players
          .sort((a, b) => b.wins - a.wins);
      })
    );
  }

  public async onAddPlayerClick(): Promise<void> {
    await this.modalHelper.showEditPlayer();
  }

  public onGameDeleteclick(e: Event, game: Game): void {
    this.modalHelper.showDelete("Are you sure you want to delete this game?")
      .then((response) => {
        if (response) {
          this.storage.removeGame(game.id);
        }
      });

    e.preventDefault();
    e.stopPropagation();
  }
}
