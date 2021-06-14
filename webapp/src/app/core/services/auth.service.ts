import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import firebase from "firebase/app";
import { Observable, of } from "rxjs";
import { first, map, mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public get idTokenResult(): Observable<firebase.auth.IdTokenResult> {
    return this.auth.idTokenResult;
  }

  public get user(): Observable<firebase.User> {
    return this.auth.authState;
  }

  public constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.auth.authState.pipe(
      first(),
      mergeMap((user) => {
        if (user) {
          return of(user);
        } else {
          return this.auth.signInAnonymously()
        }
      }),
      map((user) => {
        if ("user" in user) {
          user = user.user;
        }

        return user;
      })
    ).subscribe(() => {
      // 
    });
  }

  public getUser(): Promise<firebase.User> {
    return this.auth.currentUser;
  }
}
