import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }
  
  // data-set.service.ts ou file-template.service.ts

  downloadExcelTemplate(theme: string): void {
    const url = `http://localhost:8080/api/datasets/template/excel/${theme}`;
    const options = {
      responseType: 'blob' as 'json'  // très important pour les fichiers binaires
    };

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const fileName = `template_${theme}.xlsx`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .catch(error => {
        console.error('Erreur lors du téléchargement :', error);
      });
  }

}
