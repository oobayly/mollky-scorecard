import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { Game, PlayerRecord } from "../../../core/model";

import { PlayersListComponent } from "../../../shared/players-list/players-list.component";
import { Router } from "@angular/router";
import { StorageService } from "../../../core/services/storage.service";
import { Subscription } from "rxjs";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-new-game",
  templateUrl: "./new-game.component.html",
  styleUrls: ["./new-game.component.scss"],
})
export class NewGameComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscription[] = [];

  public get canCreate(): boolean {
    const { players, resetScore, targetScore } = this.game;

    return players.length > 1 && !!resetScore && !!targetScore;
  }

  public game: Game;

  @ViewChild("playerList")
  public playerList: PlayersListComponent;

  public constructor(
    private router: Router,
    private storage: StorageService
  ) {
    this.game = {
      currentPlayer: 0,
      id: uuidv4(),
      date: new Date(),
      players: [],
      resetScore: 25,
      targetScore: 50,
    };
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public ngAfterViewInit(): void {
    const checkedSub = this.playerList.checkedPlayers.subscribe(
      (players) => {
        this.game.players = players.map((x) => {
          return {
            misses: 0,
            player: x,
            score: 0,
            scores: [],
          } as PlayerRecord;
        });
      }
    );

    this.subscriptions.push(checkedSub);
  }

  public onCreateClick(_e: Event): void {
    const { players } = this.game;

    // Randomise the players list
    for (let i = 0; i < players.length; i++) {
      const j = Math.floor(Math.random() * i);
      const temp = players[i];

      players[i] = players[j];
      players[j] = temp;
    }

    this.storage.updateGame(this.game);

    this.router.navigateByUrl(`/game/${this.game.id}`);
  }
}
