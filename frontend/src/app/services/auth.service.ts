import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenCheckInterval: any;
  private isAlreadyExpired = false; // Pour éviter plusieurs popups

  constructor(private http: HttpClient, private router: Router) {
    // Démarrer la vérification automatique seulement si on n'est pas sur la page login
    if (!this.router.url.includes('/login')) {
      this.startTokenCheck();
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAlreadyExpired = false; // Reset le flag
    // Démarrer la vérification après avoir défini le token
    this.startTokenCheck();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      // Adaptation selon la structure de ton JWT
      return decoded.role || (decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : null) || null;
    } catch (e) {
      console.error('Erreur lors du décodage du JWT', e);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.stopTokenCheck(); // Arrêter la vérification
    this.isAlreadyExpired = false;
    this.router.navigate(['/admin/login']); 
  }

  // Démarrer la vérification périodique du token
  private startTokenCheck(): void {
    // Arrêter la vérification précédente s'il y en a une
    this.stopTokenCheck();
    
    const token = this.getToken();
    if (token && !this.isAlreadyExpired) {
      console.log('🔄 Démarrage de la vérification automatique du token...');
      
      this.tokenCheckInterval = setInterval(() => {
        this.checkTokenExpiration();
      }, 2000); // Vérifier toutes les 2 secondes (pour test avec 30 secondes)
    }
  }

  // Arrêter la vérification périodique
  private stopTokenCheck(): void {
    if (this.tokenCheckInterval) {
      console.log('⏹️ Arrêt de la vérification automatique');
      clearInterval(this.tokenCheckInterval);
      this.tokenCheckInterval = null;
    }
  }

  // Vérifier si le token a expiré (appelée automatiquement)
  private checkTokenExpiration(): void {
    const token = this.getToken();
    
    if (!token) {
      this.stopTokenCheck();
      return;
    }

    if (this.isTokenExpired(token) && !this.isAlreadyExpired) {
      console.log('⚠️ Token expiré automatiquement détecté !');
      this.isAlreadyExpired = true;
      this.stopTokenCheck(); // Arrêter la vérification
      
      Swal.fire({
        icon: 'warning',
        title: 'Session expirée',
        text: 'Votre session a expiré automatiquement. Veuillez vous reconnecter.',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        this.logout();
      });
    }
  }

  // Vérifier si le token est expiré
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      const now = Date.now();
      
      // Pour debug : afficher le temps restant
      const timeLeft = Math.max(0, Math.floor((expiration - now) / 1000));
      if (timeLeft > 0) {
        // console.log(`⏰ Temps restant: ${timeLeft} secondes`);
      }
      
      return now >= expiration;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return true;
    }
  }

  // Méthode publique pour vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  // Obtenir le temps restant avant expiration (en secondes)
  getTimeUntilExpiration(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      const now = Date.now();
      const timeLeft = Math.max(0, Math.floor((expiration - now) / 1000));
      return timeLeft;
    } catch (error) {
      return 0;
    }
  }
}