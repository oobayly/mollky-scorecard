import { Component } from "@angular/core";
import { Game } from "../../core/model";
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
    private storage: StorageService
  ) {
    this.openGames = this.storage.games.pipe(
      map((games) => {
        return games.filter((x) => !x.winner);
      })
    );
  }
}
