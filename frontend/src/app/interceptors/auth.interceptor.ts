import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpHandler } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let clonedReq = req;

  if (token && req.url !== environment.apiUrl+`/login`) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.log('Votre session a expiré. Veuillez vous reconnecter.');
        Swal.fire({
          icon: 'warning',
          title: 'Session expirée',
          text: 'Vous devez vous reconnecter.',
          confirmButtonText: 'OK'
        }).then(() => {
          authService.logout();
        });
      }
      return throwError(() => error);
    })
  );

};