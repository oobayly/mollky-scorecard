import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
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
    if (!environment.production) {
      auth.idTokenResult.subscribe((x) => {
        console.log(x.claims["sub"]);
        console.log(x.token);
      });
    }
  }
}
