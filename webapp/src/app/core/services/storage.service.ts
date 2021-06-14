import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import firebase from "firebase/app";
import { Observable, of } from "rxjs";
import { first, map, mergeMap } from "rxjs/operators";

import { Game, Player, User } from "../model";
import { AuthService } from "./auth.service";

enum Collections {
  Games = "games",
  Players = "players",
  Users = "users"
}

@Injectable({
  providedIn: "root",
})
export class StorageService {
  public readonly games: Observable<Game[]>;

  public readonly openGames: Observable<Game[]>;

  public readonly players: Observable<Player[]>;

  private readonly user: Observable<User>;

  public constructor(
    private auth: AuthService,
    private firestore: AngularFirestore
  ) {
    // User observable
    this.user = this.auth.user.pipe(
      mergeMap((user) => {
        return this.firestore.collection(Collections.Users).doc<User>(user.uid).snapshotChanges();
      }),
      map((doc) => {
        if (doc.payload.exists) {
          return doc.payload.data();
        } else {
          return {
            gameIds: [],
            playerIds: [],
          }
        }
      })
    );

    this.games = this.user.pipe(
      mergeMap((user) => {
        if (!user.gameIds?.length) {
          return of([]);
        }

        return this.firestore.collection<Game>(Collections.Games, (ref) => {
          return ref.where("id", "in", user.gameIds);
        }).snapshotChanges();
      }),
      map((docs) => {
        return docs
          .filter((x) => x.payload.doc.exists)
          .map((x) => x.payload.doc.data());
      }),
      map((games) => {
        games.forEach((x) => x.date = x.date.toDate());

        return games;
      })
    );

    this.players = this.user.pipe(
      mergeMap((user) => {
        if (!user.playerIds?.length) {
          return of([]);
        }

        return this.firestore.collection<Player>(Collections.Players, (ref) => {
          return ref.where("id", "in", user.playerIds);
        }).snapshotChanges();
      }),
      map((docs) => {
        return docs
          .map((x) => x.payload.doc.data())
          .sort((a, b) => a.name.localeCompare(b.name));
      })
    );

    // Open Games
    this.openGames = this.games.pipe(
      map((games) => {
        return games.filter((x) => !x.winner);
      })
    );
  }

  public async createGame(game: Game): Promise<void> {
    const isNewGame = !game.id;

    if (isNewGame) {
      this.validateGame(game);
    }

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const [user, userRef] = await this.getUser(transaction);

      if (isNewGame) {
        const gameRef = this.firestore.firestore.collection(Collections.Games).doc(); // https://github.com/angular/angularfire/issues/1974

        game.id = gameRef.id;

        transaction.set(gameRef, game);
      } else {
        // In case an invalid ID has been provided.
        const existing = await this.firestore.firestore.collection(Collections.Games).doc(game.id).get();

        if (!existing.exists) {
          console.log(`No game could be found with id = ${game.id}`);

          return;
        }
      }

      if (!user.gameIds.includes(game.id)) {
        user.gameIds.push(game.id);

        transaction.set(userRef, user);
      }
    });
  }

  public async createPlayer(player: Player): Promise<void> {
    const isNewPlayer = !player.id;

    if (isNewPlayer) {
      this.validatePlayer(player);
    }

    await this.firestore.firestore.runTransaction(async (transaction) => {
      const [user, userRef] = await this.getUser(transaction);

      if (isNewPlayer) {
        const playerRef = this.firestore.firestore.collection(Collections.Players).doc(); // https://github.com/angular/angularfire/issues/1974

        player.id = playerRef.id;

        transaction.set(playerRef, player);
      } else {
        // In case an invalid ID has been provided.
        const existing = await this.firestore.firestore.collection(Collections.Players).doc(player.id).get();

        if (!existing.exists) {
          console.log(`No player could be found with id = ${player.id}`);
          return;
        }
      }

      if (!user.playerIds.includes(player.id)) {
        user.playerIds.push(player.id);

        transaction.set(userRef, user);
      }
    });
  }

  private async getUser(transaction: firebase.firestore.Transaction): Promise<[User, DocumentReference]> {
    const { uid } = await this.auth.getUser();
    const userRef = this.firestore.collection(Collections.Users).doc(uid).ref;
    const userDoc = await transaction.get(userRef);
    let user: User;

    if (userDoc?.exists) {
      user = userDoc.data() as User;
    } else {
      user = {
        gameIds: [],
        playerIds: [],
      };
    }

    return [user, userRef];
  }

  public async importPlayer(id: string): Promise<void> {
    await this.createPlayer({
      id,
    } as Player)
  }

  public async  removeGame(id: string): Promise<void> {
    const { uid } = await this.auth.getUser();
    const user = await this.user.pipe(first()).toPromise();
    const usersRef = this.firestore.firestore.collection(Collections.Users);
    const index = user.gameIds.indexOf(id);

    if (index === -1) {
      return;
    }

    user.gameIds.splice(index, 1);

    const usedBy = await usersRef.where("gameIds", "array-contains", id).get();

    const batch = this.firestore.firestore.batch();

    batch.update(usersRef.doc(uid), user);

    if (usedBy.docs.length < 2) {
      batch.delete(this.firestore.firestore.collection(Collections.Games).doc(id));
    }

    await batch.commit();
  }

  public async removePlayer(id: string): Promise<void> {
    const { uid } = await this.auth.getUser();
    const user = await this.user.pipe(first()).toPromise();
    const usersRef = this.firestore.firestore.collection(Collections.Users);
    const index = user.playerIds.indexOf(id);

    if (index === -1) {
      return;
    }

    user.playerIds.splice(index, 1);

    const usedBy = await usersRef.where("playerIds", "array-contains", id).get();

    const batch = this.firestore.firestore.batch();

    batch.update(usersRef.doc(uid), user);

    if (usedBy.docs.length < 2) {
      batch.delete(this.firestore.firestore.collection(Collections.Players).doc(id));
    }

    await batch.commit();
  }

  public async updateGame(game: Game): Promise<void> {
    this.validateGame(game);

    const ref = this.firestore.collection(Collections.Games).doc(game.id);

    if (game.winner) {
      const playerRef = this.firestore.firestore.collection(Collections.Players).doc(game.winner.id);
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
