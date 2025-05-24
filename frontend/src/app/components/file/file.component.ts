import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../services/file/file.service';
import { CommonModule } from '@angular/common';
import { DataSetThemeService } from '../../services/dataSetTheme/data-set-theme.service';
import { DataSetThemeRequest } from '../../models/DataSetThemeRequest';

@Component({
  selector: 'app-file',
  imports: [CommonModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit {

  @Input() selectedThemeUuid: string = '';
  
  themes: DataSetThemeRequest[] = [];
  selectedTheme: DataSetThemeRequest | null = null;

  // Mapping des thèmes pour la correspondance avec le backend
  private themeKeyMapping: { [key: string]: string } = {
    'environnement': 'environnement',
    'sport': 'sport', 
    'finance': 'finance'
  };

  constructor(
    private fileService: FileService,
    private themeService: DataSetThemeService
  ) {}

  ngOnInit(): void {
    this.loadThemes();
  }

  ngOnChanges(): void {
    if (this.selectedThemeUuid && this.themes.length > 0) {
      this.updateSelectedTheme();
    }
  }

  private loadThemes(): void {
    this.themeService.getThemes().subscribe({
      next: (data) => {
        this.themes = data;
        if (this.selectedThemeUuid) {
          this.updateSelectedTheme();
        }
      },
      error: (err) => console.error('Erreur lors du chargement des thèmes:', err)
    });
  }

  private updateSelectedTheme(): void {
    this.selectedTheme = this.themes.find(theme => theme.uuid === this.selectedThemeUuid) || null;
  }

  private getThemeKey(themeName: string): string {
    // Convertir le nom du thème en clé pour le backend
    const normalizedName = themeName.toLowerCase();
    return this.themeKeyMapping[normalizedName] || normalizedName;
  }

  downloadTemplate(): void {
    if (this.selectedTheme) {
      const themeKey = this.getThemeKey(this.selectedTheme.name);
      this.fileService.downloadExcelTemplate(themeKey);
    }
  }
}