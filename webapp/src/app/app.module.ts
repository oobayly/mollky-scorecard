import { LOCALE_ID, NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./pages/home/home.component";
import {
  MDBBootstrapModule,
} from "angular-bootstrap-md";
import { ModalsModule } from "./modals/modals.module";
import { PlayersComponent } from "./pages/players/players.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { SharedModule } from "./shared/shared.module";
import { environment } from "../environments/environment";
import localeGB from "@angular/common/locales/en-GB"
import { registerLocaleData } from "@angular/common";

registerLocaleData(localeGB);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    // MDB
    MDBBootstrapModule.forRoot(),
    // 
    ModalsModule,
    SharedModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
  ],
  exports: [
    //
    ModalsModule,
    SharedModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: navigator.language },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
