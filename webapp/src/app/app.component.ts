import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { of } from "rxjs";
import { first, map, mergeMap, tap } from "rxjs/operators";

import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public title = "webapp";

  public constructor(
    auth: AngularFireAuth
  ) {
    auth.user.pipe(
      map(async (user) => {
        if (!user) {
          user = (await auth.signInAnonymously()).user;
        }

        return user;
      }),
    ).subscribe();

    if (!environment.production) {
      auth.idTokenResult.subscribe((x) => {
        if (x) {
          console.log(x.claims["sub"]);
          console.log(x.token);
        }
      });
    }
  }
}
