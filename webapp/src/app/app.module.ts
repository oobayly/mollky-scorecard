import {
  ButtonsModule,
  IconsModule,
  MDBBootstrapModule,
  ModalModule,
  NavbarModule,
} from "angular-bootstrap-md";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ConfirmDeleteComponent } from "./modals/confirm-delete/confirm-delete.component";
import { EditPlayerComponent } from "./modals/edit-player/edit-player.component";
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./pages/home/home.component";
import { NgModule } from "@angular/core";
import { PlayersComponent } from "./pages/players/players.component";
import { PlayersListComponent } from "./shared/players-list/players-list.component";

@NgModule({
  declarations: [
    AppComponent,
    EditPlayerComponent,
    HomeComponent,
    PlayersComponent,
    PlayersListComponent,
    ConfirmDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    // MDB
    MDBBootstrapModule.forRoot(),
    ButtonsModule,
    IconsModule,
    ModalModule,
    NavbarModule,
  ],
  exports: [
    // MDB
    ButtonsModule,
    IconsModule,
    ModalModule,
    NavbarModule,
    // Components
    PlayersListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
