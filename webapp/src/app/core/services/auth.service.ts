import { first, mergeMap } from "rxjs/operators";

import { AngularFireAuth } from "@angular/fire/auth";
import { Injectable } from "@angular/core";
import { of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public constructor(
    private auth: AngularFireAuth
  ) {
    this.auth.authState.pipe(
      first(),
      mergeMap((user) => {
        if (user) {
          return of(user);
        }  else{
          return this.auth.signInAnonymously()
        }
      })
    ).subscribe((user: firebase.User | firebase.auth.UserCredential) => {
      if ("user" in user) {
        user = user.user;
      }
    });
  }
}
