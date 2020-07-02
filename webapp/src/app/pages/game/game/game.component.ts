import { ActivatedRoute, Router } from "@angular/router";
import { Game, Player, PlayerRecord } from "../../../core/model";

import { Component } from "@angular/core";
import { StorageService } from "../../../core/services/storage.service";
import { first } from "rxjs/operators";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent {
  public readonly PIN_ORDER = [
    [7, 9, 8],
    [5, 11, 12, 6],
    [3, 10, 4],
    [1, 2],
  ];

  public get canPlay(): boolean {
    const player = this.game.players[this.game.currentPlayer];

    return (player.score !== this.game.targetScore) // Hasn't met target
      && (player.player.id !== this.game.winner?.id) // Isn't the winner
      && (player.misses < player.player.maxMisses); // Hasn't exceeded misses
  }

  public readonly checkedPins: { [key: string]: boolean } = {};

  public game: Game;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    private storage: StorageService
  ) {
    const gameId = this.route.snapshot.params["id"];

    this.storage.games.pipe(
      first()
    ).subscribe((games) => {
      this.game = games.find((x) => x.id === gameId);

      if (!this.game) {
        router.navigateByUrl("/");
      }
    });
  }

  private calculateScore(player: PlayerRecord): number {
    const score = player.scores.reduce((total, value) => {
      total += value;

      if (total > this.game.targetScore) {
        total = this.game.resetScore;
      }

      return total;
    }, 0);

    player.score = score;

    return score;
  }

  private clearPins(): void {
    Object.keys(this.checkedPins).forEach((pin) => this.checkedPins[pin] = false);
  }

  public getScore(): number {
    const checked = Object.keys(this.checkedPins)
      .filter((pin) => {
        return this.checkedPins[pin];
      });

    if (checked.length === 1) {
      return parseInt(checked[0]);
    }

    return checked.length;
  }

  private nextPlayer() {
    const { targetScore } = this.game;
    const remaining = this.game.players.filter((x) => {
      return (x.score !== targetScore) && (x.player.maxMisses > x.misses);
    });

    // The one remaining player is the default winner
    if ((remaining.length === 1) && !this.game.winner) {
      this.game.winner = remaining[0].player;

      this.game.currentPlayer = this.game.players.findIndex((x) => x.player.id === this.game.winner.id);

      return;
    }

    // Otherwise find the next eligible player
    if (remaining.length > 0) {
      let player: PlayerRecord;

      do {
        this.game.currentPlayer = (this.game.currentPlayer + 1) % this.game.players.length;

        player = this.game.players[this.game.currentPlayer];
      } while (player.score === targetScore || player.misses >= player.player.maxMisses);
    }
  }

  public onClearClick(_e: Event): void {
    this.clearPins();
  }

  public onPlayerClick(_e: Event, _player: Player): void {
  }

  public onSaveClick(_e: Event): void {
    const score = this.getScore();
    const player = this.game.players[this.game.currentPlayer];

    player.scores.push(score);
    this.calculateScore(player);
    this.clearPins();

    if (score) {
      player.misses = 0;
    } else {
      player.misses++;
    }

    if ((player.score === this.game.targetScore) && !this.game.winner) {
      this.game.winner = player.player;
    }

    this.nextPlayer();

    this.storage.updateGame(this.game);
  }
}
