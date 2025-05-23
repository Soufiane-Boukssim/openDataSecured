import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-data-set',
  imports: [],
  templateUrl: './data-set.component.html',
  styleUrl: './data-set.component.css'
})
export class DataSetComponent {
  constructor(private router:Router,private route: ActivatedRoute){}

  onUpload() {
    console.log('Upload clicked');
    this.router.navigate(['upload'], { relativeTo: this.route });

  }

  onDownload() {
    console.log('Download clicked');
    this.router.navigate(['download'], { relativeTo: this.route });
  }

}
