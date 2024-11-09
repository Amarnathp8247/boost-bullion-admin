import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  isSidebarCollapsed = false;
  isDarkMode = false;
  
  constructor(private router: Router){}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleDarkMode(isDark: any) {
    this.isDarkMode = isDark;
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Retrieve token from local storage
    
      this.router.navigate(['/login']); // Redirect to login if token is not found
    
  }
}
