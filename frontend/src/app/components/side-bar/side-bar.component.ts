import { AfterViewInit, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const toggleBtn = document.getElementById('toggleProducteurs');
    const collapseDiv = document.getElementById('producteurs-collapse');

    if (toggleBtn && collapseDiv) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          collapseDiv.classList.remove('show');
          toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
          collapseDiv.classList.add('show');
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  }
  
}
