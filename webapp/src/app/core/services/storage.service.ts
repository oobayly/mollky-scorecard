import { BehaviorSubject, Observable } from "rxjs";
import { Game, Player } from "../model";

import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private static readonly KEY_GAMES = "GAMES";

  private static readonly KEY_PLAYERS = "PLAYERS";

  public readonly _games: BehaviorSubject<Game[]>;

  public readonly _players: BehaviorSubject<Player[]>;

  public get games(): Observable<Game[]> {
    return this._games;
  }

  public get players(): Observable<Player[]> {
    return this._players;
  }

  public constructor() {
    this._players = new BehaviorSubject<Player[]>(this.getStorageItem<Player[]>(StorageService.KEY_PLAYERS, []));
    this._games = new BehaviorSubject<Game[]>(this.getStorageItem<Game[]>(StorageService.KEY_GAMES, []));
  }

  private getStorageItem<T>(key: string, emptyValue?: T): T | undefined {
    const json = localStorage.getItem(`StorageService-${key}`);

    if (!json) {
      return emptyValue;
    }

    return JSON.parse(json) as T;
  }

  public removePlayer(id: string): void {
    const list = this._players.getValue();
    const index = list.findIndex((x) => x.id === id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    this.setStorageItem(StorageService.KEY_PLAYERS, list);
    this._players.next(list);
  }

  private saveGame(game: Game): Game[] {
    const list = this._games.getValue();
    const index = list.findIndex((x) => x.id === game.id);

    if (index === -1) {
      list.push(game);
    } else {
      list[index] = game;
    }

    this.setStorageItem(StorageService.KEY_GAMES, list);
    this._games.next(list);

    return list;
  }

  private savePlayer(player: Player): Player[] {
    const list = this._players.getValue();
    const index = list.findIndex((x) => x.id === player.id);

    if (index === -1) {
      list.push(player);
    } else {
      list[index] = player;
    }

    list.sort((a, b) => a.name.localeCompare(b.name));

    this.setStorageItem(StorageService.KEY_PLAYERS, list);
    this._players.next(list);

    return list;
  }

  private setStorageItem<T>(key: string, value: T | undefined): void {
    let json: string | null;

    if (value == undefined) {
      json = null;
    } else {
      json = JSON.stringify(value);
    }

    localStorage.setItem(`StorageService-${key}`, json);
  }

  public updateGame(game: Game): void {
    if (!game.id) {
      game.id = uuidv4();
    }

    if (game.players.length < 2) {
      throw new TypeError("At least two players are required.");
    }

    this.saveGame(game);
  }

  public updatePlayer(player: Player): void {
    if (!player.id) {
      player.id = uuidv4();
    }

    if (!player.name) {
      throw new TypeError("The player's name is required.");
    }

    this.savePlayer(player);
  }
}
