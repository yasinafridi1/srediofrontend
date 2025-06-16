import { Component } from '@angular/core';
import { DashboardCardsComponent } from '@Components/dashboard-cards/dashboard-cards.component';
import { PageTitleComponent } from '@Components/page-title/page-title.component';
import { ENUMS } from '@Constants/index';
import { LocalStorageService } from '@Services/local-storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PageTitleComponent, DashboardCardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userData: any = {};

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit() {
    this.userData = this.localStorage.getData(ENUMS.userData);
  }
}
