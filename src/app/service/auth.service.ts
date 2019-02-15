import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs/index";
import {User} from "../model/config/user.model";
import {catchError, mergeMap} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token:string;



  constructor(private httpClient:HttpClient) {
    this.token = localStorage.getItem("token")
  }

  getCurrentUser():Observable<User>{
    return this.httpClient.get<User>("/api/v1/auth/current").pipe(catchError((e)=>{
      this.token = null;
      localStorage.removeItem("token")
    }))
  }

  login(username:string, password:string):Observable<User>{
    return this.httpClient.post<any>("/api/v1/auth/token",{username:username,password:password}).pipe(
      mergeMap((r)=>{
        this.token = r.token;
        localStorage.setItem("token",this.token)
        return this.getCurrentUser()
      }),
      catchError((e)=>{
        this.token = null;
        localStorage.removeItem("token")
      })
    )
  }

  logout(){
    localStorage.removeItem("token")
    document.location.reload()
  }
}
