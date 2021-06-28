import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Game, Player } from "../../core/model";
import { ModalHelperService } from "../../core/services/modal-helper.service";
import { StorageService } from "../../core/services/storage.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  public readonly leagueTable$: Observable<Player[]>;

  public readonly openGames$: Observable<Game[]>;

  public constructor(
    private modalHelper: ModalHelperService,
    private storage: StorageService
  ) {
    this.leagueTable$ = this.storage.getPlayers().pipe(
      map((players) => {
        return players.sort((a, b) => a.name.localeCompare(b.name));
      })
    );

    this.openGames$ = this.storage.getOpenGames();
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

  public onGameShareClick(e: Event, game: Game): void {
    const uri = `${document.location.origin}/link/game/${game.id}`;

    this.modalHelper.showQrCode("Share Game", uri);

    e.preventDefault();
    e.stopPropagation();
  }
}
