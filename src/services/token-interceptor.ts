import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {AuthService} from "./auth";

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService) {
    console.log(this.authService.getToken());
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable <HttpEvent <any> > {

    console.log(this.authService.getToken());

    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    });

    return next.handle(request).do((event: HttpEvent <any>) => {
      if( event instanceof HttpResponse ) {
        //  à priori on ne fait rien ;)
      }
    }, error => {
      if( error instanceof  HttpErrorResponse ) {
        if( error.status === 401 ) {
          //  On peut prévoir une erreur ici
        }
      }
    });
  }
}
