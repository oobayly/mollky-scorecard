import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GameComponent } from "./game/game.component";
import { LinkRoutingModule } from "./link-routing.module";
import { PlayerComponent } from "./player/player.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    GameComponent,
    PlayerComponent,
  ],
  imports: [
    CommonModule,
    LinkRoutingModule,
    SharedModule,
  ],
})
export class LinkModule { }
