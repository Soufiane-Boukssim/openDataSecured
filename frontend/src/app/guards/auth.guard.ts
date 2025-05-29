import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Utiliser la méthode isAuthenticated qui vérifie à la fois l'existence et la validité du token
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Si pas authentifié ou token expiré, rediriger vers login
    return this.router.parseUrl('/admin/login');
  }
}