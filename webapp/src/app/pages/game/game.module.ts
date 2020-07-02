import { CommonModule } from "@angular/common";
import { GameComponent } from "./game/game.component";
import { GameRoutingModule } from "./game-routing.module";
import { NewGameComponent } from "./new-game/new-game.component";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [NewGameComponent, GameComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    // 
    SharedModule,
  ],
  exports: [
  ],
})
export class GameModule { }
