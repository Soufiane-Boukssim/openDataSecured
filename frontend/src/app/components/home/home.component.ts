import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { DataProviderOrganisationServiceService } from '../../services/dataProviderOrganisation/data-provider-organisation-service.service';
import { DataProviderOrganisationMemberService } from '../../services/dataProviderOrganisationMember/data-provider-organisation-member.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  stats = [
    { title: 'Thèmes', count: 0, bgClass: 'bg-primary', icon: 'bi bi-tags' },
    { title: 'Organisations Producteurs', count: 0, bgClass: 'bg-success', icon: 'bi bi-building' },
    { title: 'Membres Producteurs', count: 0, bgClass: 'bg-warning', icon: 'bi bi-people' },
    { title: 'Jeux de Données', count: 0, bgClass: 'bg-info', icon: 'bi bi-database' }
  ];

  constructor(private themeService: DataSetThemeService, private organisationService: DataProviderOrganisationServiceService, private memberService: DataProviderOrganisationMemberService) {}

  ngOnInit(): void {
    this.loadThemeCount();
    this.loadOrganisationCount();
    this.loadMemberCount(); // ← appel ajouté
  }


  loadThemeCount(): void {
    this.themeService.getThemeCount().subscribe(
      count => this.stats[0].count = count,
      error => console.error('Erreur lors du chargement du nombre de thèmes', error)
    );
  }


  loadOrganisationCount(): void {
  this.organisationService.getOrganisationCount().subscribe(
    count => this.stats[1].count = count, // ← stats[1] correspond à "Organisations Producteurs"
    error => console.error('Erreur lors du chargement du nombre d\'organisations', error)
  );
}

loadMemberCount(): void {
  this.memberService.getOrganisationMemberCount().subscribe(
    count => this.stats[2].count = count, // ← stats[2] correspond aux membres
    error => console.error('Erreur lors du chargement du nombre de membres', error)
  );
}


}
