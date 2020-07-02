import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./pages/home/home.component";
import { NgModule } from "@angular/core";
import { PlayersComponent } from "./pages/players/players.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "players", component: PlayersComponent },
  { path: "game", loadChildren: () => (import("./pages/game/game.module").then(m => m.GameModule)) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
