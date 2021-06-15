import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, first, mergeMap } from "rxjs/operators";

import { StorageService } from "../../core/services/storage.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnInit {
  private readonly playerId: string;

  public constructor(
    private auth: AngularFireAuth,
    route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) {
    this.playerId = route.snapshot.params.playerId;
  }

  private importPlayer() {
    // Only import when the user is logged in
    this.auth.user.pipe(
      filter((user) => !!user),
      first(),
      mergeMap(() => this.storage.importPlayer(this.playerId)),
    ).subscribe(() => {
      this.router.navigate(["players"]);
    });
  }

  public ngOnInit(): void {
    this.importPlayer();
  }
}
