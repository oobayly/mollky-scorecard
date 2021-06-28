import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, first, mergeMap } from "rxjs/operators";

import { StorageService } from "../../core/services/storage.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
  private readonly gameId: string;

  public constructor(
    private auth: AngularFireAuth,
    route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) {
    this.gameId = route.snapshot.params.gameId;
  }

  private importPlayer() {
    // Only import when the user is logged in
    this.auth.user.pipe(
      filter((user) => !!user),
      first(),
      mergeMap(() => this.storage.importGame(this.gameId)),
    ).subscribe(() => {
      this.router.navigate(["game", this.gameId]);
    });
  }

  public ngOnInit(): void {
    this.importPlayer();
  }
}
