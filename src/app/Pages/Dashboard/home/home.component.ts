import { Component } from '@angular/core';
import { DashboardCardsComponent } from '@Components/dashboard-cards/dashboard-cards.component';
import { PageTitleComponent } from '@Components/page-title/page-title.component';
import { API_URL, ENUMS } from '@Constants/index';
import { ApiService } from '@Services/api.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
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

  constructor(
    private localStorage: LocalStorageService,
    private api: ApiService,
    private asyncHandler: AsyncHandlerService
  ) {}

  ngOnInit() {
    this.userData = this.localStorage.getData(ENUMS.userData);
  }
}
