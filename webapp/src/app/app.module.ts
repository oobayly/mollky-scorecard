import { registerLocaleData } from "@angular/common";
import localeGB from "@angular/common/locales/en-GB"
import { LOCALE_ID, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { USE_EMULATOR as USE_AUTH_EMULATOR } from "@angular/fire/auth";
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from "@angular/fire/firestore";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {
  MDBBootstrapModule,
} from "angular-bootstrap-md";
import { ServiceWorkerModule } from "@angular/service-worker";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./pages/home/home.component";
import { ModalsModule } from "./modals/modals.module";
import { PlayersComponent } from "./pages/players/players.component";
import { SharedModule } from "./shared/shared.module";
import { environment } from "../environments/environment";

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
    // Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
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
    { provide: USE_AUTH_EMULATOR, useValue: environment.production ? undefined : ["localhost", 9099] },
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.production ? undefined : ["localhost", 8080] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
