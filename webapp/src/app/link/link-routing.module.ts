import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PlayerComponent } from "./player/player.component";

const routes: Routes = [
  // { path: "game/:gameId", component: GameComponent },
  { path: "player/:playerId", component: PlayerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkRoutingModule { }
