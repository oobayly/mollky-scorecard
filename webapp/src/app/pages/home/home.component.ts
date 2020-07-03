import { Component } from "@angular/core";
import { Game } from "../../core/model";
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
  public readonly openGames: Observable<Game[]>;

  public constructor(
    private modalHelper: ModalHelperService,
    private storage: StorageService
  ) {
    this.openGames = this.storage.games.pipe(
      map((games) => {
        return games.filter((x) => !x.winner);
      })
    );
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
