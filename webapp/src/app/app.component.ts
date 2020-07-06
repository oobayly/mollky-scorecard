import { AuthService } from "./core/services/auth.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public title = "webapp";

  public constructor(
    private auth: AuthService
  ) {
  }
}
