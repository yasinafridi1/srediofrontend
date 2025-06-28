import { MainLoaderComponent } from '@Components/Loader/main-loader/main-loader.component';
import { API_URL, ENUMS } from '@Constants/index';
import { ApiService } from '@Services/api.service';
import { LocalStorageService } from '@Services/local-storage.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLoaderComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  loading: boolean = false;

  airtableSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2500 2500"><path fill="#FCB400" d="M0 1048.6 1232.3 0v796.2L0 1844.8V1048.6"/><path fill="#19B5FE" d="m0 1844.8 1232.3 604.5v-796L0 1048.6v796.2"/><path fill="#EE4957" d="M1232.3 0 2500 751.5v796.2L1232.3 796.2V0"/><path fill="#F08200" d="m2500 751.5-1267.7 695v796.2L2500 1547.7V751.5"/></svg>`;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private api: ApiService,
    private localStorage: LocalStorageService
  ) {
    this.matIconRegistry.addSvgIconLiteral(
      'airtable',
      this.sanitizer.bypassSecurityTrustHtml(this.airtableSvgIcon)
    );
  }

  ngOnInit() {
    this.registerServiceWorker();
    this.checkLogin();
  }

  checkLogin() {
    const refreshToken = this.localStorage.getData(ENUMS.refreshToken);
    if (refreshToken) {
      this.loading = true;
      this.api.postData(API_URL.autoLogin, { refreshToken }).subscribe({
        next: (res) => {
          this.localStorage.setJwtTokens(res.data);
          this.localStorage.setData(ENUMS.userData, res.data.userData);
        },
        error: (err) => {
          console.error('Error during auto-login', err);
          this.loading = false;
          this.router.navigate(['/auth/signin']);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log(
              'Service Worker registered with scope:',
              registration.scope
            );
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err);
          });
      });
    }
  }
}
