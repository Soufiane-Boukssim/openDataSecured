import { Component, Input } from '@angular/core';
import { FileService } from '../../services/file/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file',
  imports: [CommonModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})

export class FileComponent {

  @Input() selectedThemeUuid: string = ''; // <- Ici tu reçois le thème

  themes = [
    { name: 'Environnement', key: 'environnement' },
    { name: 'Sport', key: 'sport' },
    { name: 'Finance', key: 'finance' }
  ];

  constructor(private fileService: FileService) {}

  get filteredThemes() {
  return this.themes.filter(t => t.key === this.selectedThemeUuid);
}


  downloadTemplate(theme: string): void {
    this.fileService.downloadExcelTemplate(theme);
  }
}
