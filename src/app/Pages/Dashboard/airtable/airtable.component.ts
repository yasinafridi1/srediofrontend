import { AirTableLoginComponent } from '@Components/air-table-login/air-table-login.component';
import { AirTableMfaComponent } from '@Components/air-table-mfa/air-table-mfa.component';
import { PageTitleComponent } from '@Components/page-title/page-title.component';
import { API_URL } from '@Constants/index';
import { ApiService } from '@Services/api.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
import { LocalStorageService } from '@Services/local-storage.service';
import { ToastserviceService } from '@Services/toastservice.service';
import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-airtable',
  standalone: true,
  imports: [
    PageTitleComponent,
    NgIf,
    MatProgressSpinnerModule,
    MatButton,
    NgClass,
  ],
  templateUrl: './airtable.component.html',
  styleUrl: './airtable.component.css',
})
export class AirtableComponent {
  userData: any = {
    airtable: 'hello',
  };
  loading: boolean = false;
  isDataFetched: boolean = true;
  scrappingLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private localStorage: LocalStorageService,
    private toast: ToastserviceService,
    private api: ApiService,
    private asyncHandler: AsyncHandlerService
  ) {}

  ngOnInit() {
    const scrapping = this.localStorage.getData('scrapping');

    // Convert safely to a boolean
    this.scrappingLoading = scrapping === true;
  }

  openAirtableLogin() {
    this.localStorage.setData('scrapping', false);
    const dialogRef = this.dialog.open(AirTableLoginComponent, {
      maxWidth: '600px',
      width: '90%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.asyncHandler.handleObservable(
          this.api.postData(API_URL.airtableLogin, result),
          (res: any) => {
            const { mfa, sessionId } = res?.data;
            if (mfa && mfa?.required) {
              this.openMfaModal(sessionId);
            } else {
              this.localStorage.setData('scrapping', true);
              this.scrappingLoading = true;
              this.toast.successMessage(res.message || 'Scrapping started');
            }
          }
        );
      }
    });
  }

  openMfaModal(session: string) {
    const dialogRef = this.dialog.open(AirTableMfaComponent, {
      maxWidth: '600px',
      width: '90%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          code: result,
          sessionId: session,
        };
        this.asyncHandler.handleObservable(
          this.api.postData(API_URL.airtableMfa, data),
          (res: any) => {
            const { data } = res;
            if (!data.isValid) {
              this.toast.errorMessage('Invalid Code');
              this.openMfaModal(data.sessionId);
            } else {
              this.localStorage.setData('scrapping', true);
              this.scrappingLoading = true;
              this.toast.successMessage(
                res?.message || 'Scrapping started successfully'
              );
            }
          }
        );
      }
    });
  }
}
