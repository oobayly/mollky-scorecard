import { Component } from "@angular/core";
import { FormArray, FormBuilder, ValidatorFn, Validators } from "@angular/forms";
import { MDBModalRef } from "angular-bootstrap-md";
import { firstValueFrom } from "rxjs";

import { PlayerRecord, calculateScore } from "../../core/model";
import { StorageService } from "../../core/services/storage.service";

@Component({
  selector: "app-edit-score",
  templateUrl: "./edit-score.component.html",
  styles: [
  ],
})
export class EditScoreComponent {
  private gameId: string;

  public scoreForm: FormArray;

  public get playerName(): string {
    return this.record?.name;
  }

  private record: PlayerRecord;

  public constructor(
    private formBuilder: FormBuilder,
    private modalRef: MDBModalRef,
    private storage: StorageService
  ) {
  }

  public hide(): void {
    this.modalRef.hide();
  }

  public async onSaveClick(_e: Event): Promise<void> {
    if (!this.scoreForm.valid) {
      return;
    }

    const game = await firstValueFrom(this.storage.getGame(this.gameId));

    this.record.scores = this.scoreForm.value;
    calculateScore(this.record, game.targetScore, game.resetScore);

    const recordIndex = game.players.findIndex((x) => x.id === this.record.id);

    game.players[recordIndex] = this.record;

    this.storage.updateGame(game);

    this.hide();
  }

  public setPlayerRecord(gameId: string, record: PlayerRecord): void {
    const validators: ValidatorFn[] = [
      Validators.required, Validators.min(0), Validators.max(12),
    ];
    const formControls = record.scores.map((score) => {
      return this.formBuilder.control(score, validators);
    })

    this.gameId = gameId;
    this.record = record;
    this.scoreForm = this.formBuilder.array(formControls, {
      updateOn: "change",
    });
  }
}
