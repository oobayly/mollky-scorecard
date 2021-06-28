import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { firstValueFrom, Observable } from "rxjs";
import { filter, first, map, mergeMap } from "rxjs/operators";

import { Game, Player } from "../model";

enum Collections {
  Games = "games",
  Players = "players",
}

@Injectable({
  providedIn: "root",
})
export class StorageService {
  public constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
  }

  public async createGame(game: Game): Promise<void> {
    this.validateGame(game);

    const { uid } = await this.auth.currentUser;
    const gameRef = this.firestore.firestore.collection(Collections.Games).doc();

    game.id = gameRef.id;
    game.users.push(uid);

    await gameRef.set(game);
  }

  public async createPlayer(player: Player): Promise<void> {
    this.validatePlayer(player);

    const { uid } = await this.auth.currentUser;
    const playerRef = this.firestore.firestore.collection(Collections.Players).doc();

    player.id = playerRef.id;
    player.users.push(uid);

    await playerRef.set(player);
  }

  public getGame(id: string): Observable<Game> {
    return this.firestore.collection<Game>(Collections.Games).doc(id).get().pipe(
      first(),
      map((doc) => doc.data())
    );
  }

  public getGames(): Observable<Game[]> {
    return this.auth.user.pipe(
      filter((user) => !!user),
      mergeMap((user) => {
        return this.firestore.collection<Game>(
          Collections.Games,
          ref => ref.where("users", "array-contains", user.uid)
        ).snapshotChanges();
      }),
      map((games) => {
        return games.map((item) => item.payload.doc.data());
      })
    );
  }

  public getOpenGames(): Observable<Game[]> {
    return this.getGames().pipe(
      map((games) => games.filter((g) => !g.winner))
    );
  }

  public getPlayer(id: string): Observable<Player> {
    return this.firestore.collection<Player>(Collections.Players).doc(id).get().pipe(
      first(),
      map((doc) => doc.data())
    );
  }

  public getPlayers(): Observable<Player[]> {
    return this.auth.user.pipe(
      filter((user) => !!user),
      mergeMap((user) => {
        return this.firestore.collection<Player>(Collections.Players, ref => ref.where("users", "array-contains", user.uid)).snapshotChanges();
      }),
      map((games) => {
        return games.map((item) => item.payload.doc.data());
      })
    );
  }

  public async importGame(id: string): Promise<void> {
    const { uid } = await this.auth.currentUser;
    const gameRef = this.firestore.collection<Game>(Collections.Games).doc(id);
    const game = (await firstValueFrom(gameRef.get())).data();

    if (!game) {
      throw new Error("No game could be found.");
    }

    if (!game.users.some((u) => u === uid)) {
      game.users.push(uid);
    }

    await gameRef.update({
      users: game.users,
    });
  }

  public async importPlayer(id: string): Promise<void> {
    const { uid } = await this.auth.currentUser;
    const playerRef = this.firestore.collection<Player>(Collections.Players).doc(id);
    const player = (await firstValueFrom(playerRef.get())).data();

    if (!player) {
      throw new Error("No player could be found.");
    }

    if (!player.users.some((u) => u === uid)) {
      player.users.push(uid);
    }

    await playerRef.update({
      users: player.users,
    });
  }

  public async removeGame(id: string): Promise<void> {
    const { uid } = await this.auth.currentUser;
    const gameRef = this.firestore.collection<Game>(Collections.Games).doc(id);
    const game = (await firstValueFrom(gameRef.get())).data();

    if (game == null) {
      return;
    }

    game.users = game.users.filter((u) => u !== uid);

    if (game.users.length) {
      await gameRef.update({
        users: game.users,
      });
    } else {
      await gameRef.delete();
    }
  }

  public async removePlayer(id: string): Promise<void> {
    const { uid } = await this.auth.currentUser;

    const playerRef = this.firestore.collection<Player>(Collections.Players).doc(id);
    const player = (await firstValueFrom(playerRef.get())).data();

    if (player == null) {
      return;
    }

    player.users = player.users.filter((u) => u !== uid);

    if (player.users.length) {
      await playerRef.update({
        users: player.users,
      });
    } else {
      await playerRef.delete();
    }
  }

  public async updateGame(game: Game): Promise<void> {
    this.validateGame(game);

    const ref = this.firestore.collection(Collections.Games).doc(game.id);

    if (game.winner) {
      const playerRef = this.firestore.firestore.collection(Collections.Players).doc(game.winner);
      const increment = firebase.firestore.FieldValue.increment(1);

      await playerRef.update({ wins: increment });
    }

    await ref.update(game);
  }

  public async updatePlayer(player: Player): Promise<void> {
    this.validatePlayer(player);

    const ref = this.firestore.collection(Collections.Players).doc(player.id);

    await ref.update(player);
  }

  private validateGame(game: Game): void {
    if (game.players.length < 2) {
      throw new TypeError("At least two players are required.");
    }
  }

  private validatePlayer(player: Player): void {
    player.name = (player.name || "").trim();

    if (!player.name) {
      throw new TypeError("The player's name is required.");
    }
  }
}
