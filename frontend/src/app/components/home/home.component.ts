import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  stats = [
    { title: 'Thèmes', count: 8, bgClass: 'bg-primary', icon: 'bi bi-tags' },
    { title: 'Organisations Producteurs', count: 5, bgClass: 'bg-success', icon: 'bi bi-building' },
    { title: 'Membres Producteurs', count: 23, bgClass: 'bg-warning', icon: 'bi bi-people' },
    { title: 'Jeux de Données', count: 12, bgClass: 'bg-info', icon: 'bi bi-database' },
    { title: 'Utilisateurs Admin', count: 2, bgClass: 'bg-danger', icon: 'bi bi-person-lock' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
