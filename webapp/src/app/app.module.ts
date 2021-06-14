import { registerLocaleData } from "@angular/common";
import localeGB from "@angular/common/locales/en-GB"
import { LOCALE_ID, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MDBBootstrapModule,
} from "angular-bootstrap-md";
import { ServiceWorkerModule } from "@angular/service-worker";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./pages/home/home.component";
import { ModalsModule } from "./modals/modals.module";
import { PlayersComponent } from "./pages/players/players.component";
import { SharedModule } from "./shared/shared.module";
import { environment } from "../environments/environment";

registerLocaleData(localeGB);

// See https://stackoverflow.com/a/65514850/422689
const fbApp = firebase.initializeApp(environment.firebaseConfig, "fbApp");
if (!environment.production) {
  fbApp.auth().useEmulator("http://localhost:9099");
  fbApp.firestore().useEmulator("localhost", 8080);
}

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
    AngularFireModule.initializeApp(environment.firebaseConfig, fbApp.name),
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
