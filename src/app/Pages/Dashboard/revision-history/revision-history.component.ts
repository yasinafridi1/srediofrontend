import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageTitleComponent } from '../../../Components/page-title/page-title.component';
import { GridLoaderComponent } from '@Components/Loader/grid-loader/grid-loader.component';
import { AgGridAngular } from 'ag-grid-angular';
import { NgFor, NgIf } from '@angular/common';
import { themeBalham } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { ToastserviceService } from '@Services/toastservice.service';
import { ApiService } from '@Services/api.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
import { API_URL } from '@Constants/index';

@Component({
  selector: 'app-revision-history',
  imports: [
    PageTitleComponent,
    GridLoaderComponent,
    AgGridAngular,
    NgIf,
    NgFor,
  ],
  templateUrl: './revision-history.component.html',
  styleUrl: './revision-history.component.css',
})
export class RevisionHistoryComponent {
  theme = themeBalham;
  loading: boolean = false;
  revisionCols: ColDef[] = [];
  rowData: any = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  recordId: string = '';

  constructor(
    private route: ActivatedRoute,
    private toast: ToastserviceService,
    private api: ApiService,
    private asyncHandler: AsyncHandlerService
  ) {}

  ngOnInit(): void {
    this.recordId = this.route.snapshot.paramMap.get('recordId') || '';
    this.getHistoryDetail();
  }

  generateAgGrid(data: any) {
    this.revisionCols = Object.keys(data[0]).map((key) => {
      return {
        field: key,
        filter: true,
        sortable: true,
      };
    });
    this.rowData = data;
    this.loading = false;
  }

  getVisiblePages(): number[] {
    const visiblePages = [];
    const range = 1; // How many pages to show around current
    for (
      let i = Math.max(1, this.currentPage - range);
      i <= Math.min(this.totalPages - 1, this.currentPage + range);
      i++
    ) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.getHistoryDetail();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getHistoryDetail();
    }
  }

  getHistoryDetail() {
    this.loading = true;
    this.asyncHandler.handleObservable(
      this.api.getData(
        `${API_URL.recordRevisionHistory}/${this.recordId}?page=${this.currentPage}&limit=${this.pageSize}`
      ),
      (res: any) => {
        const { revisionData, totalItems, totalPages: pagesCount } = res?.data;
        if (revisionData.length) {
          this.generateAgGrid(revisionData);
          this.totalPages = pagesCount;
          this.totalRecords = totalItems;
        } else {
          this.rowData = []; // Clear old data
          this.revisionCols = []; // Clear old columns
          this.totalPages = 0;
          this.totalRecords = 0;
          this.loading = false;
        }
      }
    );
  }
}
