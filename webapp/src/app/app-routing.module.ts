import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./pages/home/home.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "game", loadChildren: () => (import("./pages/game/game.module").then(m => m.GameModule)) },
  { path: "link", loadChildren: () => (import("./link/link.module").then(m => m.LinkModule)) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
