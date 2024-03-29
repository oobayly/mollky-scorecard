import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { Game, PlayerRecord, calculateScore } from "../../../core/model";
import { ModalHelperService } from "../../../core/services/modal-helper.service";
import { StorageService } from "../../../core/services/storage.service";
import { WakeLockService } from "../../../core/services/wake-lock.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements AfterViewInit, OnDestroy {
  public readonly PIN_ORDER = [
    [7, 9, 8],
    [5, 11, 12, 6],
    [3, 10, 4],
    [1, 2],
  ];

  public get canPlay(): boolean {
    const player = this.currentPlayer;

    return (player.score !== this.game.targetScore) // Hasn't met target
      && (player.id !== this.game.winner) // Isn't the winner
      && (player.misses < player.maxMisses); // Hasn't exceeded misses
  }

  public readonly checkedPins: { [key: string]: boolean } = {};

  public get currentPlayer(): PlayerRecord {
    return this.game.players[this.game.currentPlayer];
  }

  public game: Game;

  public get scoreToWin(): number {
    return this.game.targetScore - (this.currentPlayer?.score || 0);
  }

  private readonly subscriptions: Subscription[] = [];

  public constructor(
    private modalHelper: ModalHelperService,
    private route: ActivatedRoute,
    router: Router,
    private storage: StorageService,
    public wakeLock: WakeLockService,
  ) {
    const gameId = this.route.snapshot.params["id"];

    const gameSub = this.storage.getGame(gameId).subscribe((game) => {
      if (!game) {
        router.navigateByUrl("/");

        return;
      }

      this.game = game;
    });

    this.subscriptions.push(gameSub);
  }

  public ngAfterViewInit(): void {
    // Request a wake lock
    if (this.wakeLock.isSupported) {
      this.wakeLock.requestLock("screen")
        .then((_resp) => {
          //
        }).catch((_e) => {
          //
        });
    }
  }

  public ngOnDestroy(): void {
    // Release the wake lock
    if (this.wakeLock.isLocked) {
      this.wakeLock.releaseLock()
        .then(() => {
          //
        });
    }

    this.subscriptions.forEach((s) => s.unsubscribe());
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
      return (x.score !== targetScore) && (x.maxMisses > x.misses);
    });

    // The one remaining player is the default winner
    if ((remaining.length === 1) && !this.game.winner) {
      this.game.winner = remaining[0].id;

      this.game.currentPlayer = this.game.players.findIndex((x) => x.id === this.game.winner);

      return;
    }

    // Otherwise find the next eligible player
    if (remaining.length > 0) {
      let player: PlayerRecord;

      do {
        this.game.currentPlayer = (this.game.currentPlayer + 1) % this.game.players.length;

        player = this.game.players[this.game.currentPlayer];
      } while (player.score === targetScore || player.misses >= player.maxMisses);
    }
  }

  public onClearClick(_e: Event): void {
    this.clearPins();
  }

  public async onPlayerClick(_e: Event, record: PlayerRecord): Promise<void> {
    await this.modalHelper.showEditScore(this.game.id, record);
  }

  public onSaveClick(_e: Event): void {
    const score = this.getScore();
    const record = this.game.players[this.game.currentPlayer];

    record.scores.push(score);
    calculateScore(record, this.game.targetScore, this.game.resetScore);

    this.clearPins();

    if ((record.score === this.game.targetScore) && !this.game.winner) {
      this.game.winner = record.id;
    }

    this.nextPlayer();

    this.storage.updateGame(this.game);
  }
}
