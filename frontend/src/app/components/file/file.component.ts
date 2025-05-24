import { Component } from '@angular/core';
import { FileService } from '../../services/file/file.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file',
  imports: [CommonModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})

export class FileComponent {
  themes = [
    { name: 'Environnement', key: 'environnement' },
    { name: 'Sport', key: 'sport' },
    { name: 'Finance', key: 'finance' }
  ];

  constructor(private fileService: FileService) {}

  downloadTemplate(theme: string): void {
    this.fileService.downloadExcelTemplate(theme);
  }
}
