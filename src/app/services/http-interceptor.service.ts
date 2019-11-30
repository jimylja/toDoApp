import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  private readonly url: string = 'http://localhost:3000';
  constructor() { }

  /**
   * Method catch any request, then adds basic url of the backend server
   * and then returns an updated request
   * @param request - Incoming request
   * @param next - transforms httpRequest into a stream of HttpEvents, one of which will be HttpResponse
   * @returns - call of transformed request
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      url: this.url + request.url
    });
    return next.handle(request);
  }
}

