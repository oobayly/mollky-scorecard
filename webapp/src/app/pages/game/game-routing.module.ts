import { RouterModule, Routes } from "@angular/router";

import { GameComponent } from "./game/game.component";
import { NewGameComponent } from "./new-game/new-game.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  { path: "new", component: NewGameComponent },
  { path: ":id", component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule { }
