import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { SidebarServiceService } from '@Services/sidebar-service.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { sidebar } from '@Assets/data/sidebardata';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterLink,
    NgFor,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidenavOpen = true;
  sidebarData = sidebar;
  constructor(private sidebarservice: SidebarServiceService) {
    this.sidebarservice.getSidebarStatus().subscribe((status) => {
      this.isSidenavOpen = status;
    });
  }
}
