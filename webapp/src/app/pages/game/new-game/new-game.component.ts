import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import firebase from "firebase/app";
import { Subscription } from "rxjs";

import { Game } from "../../../core/model";
import { PlayersListComponent } from "../../../shared/players-list/players-list.component";
import { StorageService } from "../../../core/services/storage.service";

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
      id: null,
      date: firebase.firestore.Timestamp.now(),
      players: [],
      resetScore: 25,
      targetScore: 50,
      users: [],
    };
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  public ngAfterViewInit(): void {
    const checkedSub = this.playerList.checkedPlayers$.subscribe(
      (players) => {
        this.game.players = players.map((x) => {
          return {
            id: x.id,
            maxMisses: x.maxMisses,
            misses: 0,
            name: x.name,
            score: 0,
            scores: [],
          };
        });
      }
    );

    this.subscriptions.push(checkedSub);
  }

  public async onCreateClick(_e: Event): Promise<void> {
    const { players } = this.game;

    // Randomise the players list
    for (let i = 0; i < players.length; i++) {
      const j = Math.floor(Math.random() * i);
      const temp = players[i];

      players[i] = players[j];
      players[j] = temp;
    }

    await this.storage.createGame(this.game);

    this.router.navigateByUrl(`/game/${this.game.id}`);
  }
}
