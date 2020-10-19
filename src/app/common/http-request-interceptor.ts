import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(private accountService: AccountService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let jwtoken = this.accountService.getJWT();
        if (jwtoken == null) {
            req = req.clone({
                withCredentials: true
            });

        } else {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtoken}`
                },
                withCredentials: true,

            });
        }

        return next.handle(req);
    }
}
