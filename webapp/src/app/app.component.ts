import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { map } from "rxjs/operators";

import { environment } from "../environments/environment";

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
