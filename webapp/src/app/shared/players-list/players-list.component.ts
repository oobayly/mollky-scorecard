import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import { ModalHelperService } from "../../core/services/modal-helper.service";
import { Player } from "../../core/model";
import { StorageService } from "../../core/services/storage.service";
import { map } from "rxjs/operators";

export interface PlayerCheckEvent {
  checked: boolean;
 
  player: Player;
}

@Component({
  selector: "app-players-list",
  templateUrl: "./players-list.component.html",
  styleUrls: ["./players-list.component.scss"],
})
export class PlayersListComponent {
  private readonly checkedIds = new BehaviorSubject<string[]>([]);

  @Input()
  public canEdit = false;

  @Input()
  public canSelect = false;

  public readonly checkedPlayers: Observable<Player[]>;

  @Output()
  public playerCheck = new EventEmitter<PlayerCheckEvent>();

  @Output()
  public playerClick = new EventEmitter<Player>();

  public readonly players: Observable<Player[]>;

  @Input()
  public showMaxMisses = true;

  public constructor(
    private modalHelper: ModalHelperService,
    private storage: StorageService
  ) {
    this.players = this.storage.players;

    this.checkedPlayers = combineLatest([this.checkedIds, this.players])
      .pipe(
        map(([ids, players]) => {
          return players.filter((player) => ids.some((x) => player.id === x));
        })
      );
  }

  public onPlayerCheckChange(e: Event, item: Player): void {
    const input = e.target as HTMLInputElement;
    const { id } = item;
    const list = this.checkedIds.getValue();
    const index = list.findIndex((x) => x === id);

    if (input.checked && index === -1) {
      list.push(id);
    } else if (index !== -1) {
      list.splice(index, 1);
    }

    this.checkedIds.next(list);

    this.playerCheck.emit({
      checked: input.checked,
      player: item,
    });
  }

  public onPlayerClick(e: Event, item: Player): void {
    if (this.playerClick) {
      this.playerClick.emit(item);
    }

    e.stopPropagation();
  }

  public async onPlayerDeleteClick(e: Event, item: Player): Promise<void> {
    const response = await this.modalHelper.showDelete(`Are you sure you want to delete ${item.name}?`)
    
    if (response) {
      this.storage.removePlayer(item.id);
    }

    e.stopPropagation();
  }

  public async onPlayerEditClick(e: Event, item: Player): Promise<void> {
    await this.modalHelper.showEditPlayer(item);

    e.stopPropagation();
  }
}
