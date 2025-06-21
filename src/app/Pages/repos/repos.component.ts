import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageTitleComponent } from '@Components/page-title/page-title.component';
import { API_URL, ENUMS } from '@Constants/index';
import { ApiService } from '@Services/api.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
import { LocalStorageService } from '@Services/local-storage.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridApi } from 'ag-grid-community';

import {
  AllCommunityModule,
  ModuleRegistry,
  ClientSideRowModelModule,
} from 'ag-grid-community';
import { GridLoaderComponent } from '@Components/Loader/grid-loader/grid-loader.component';
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);
@Component({
  selector: 'app-repos',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AgGridAngular,
    GridLoaderComponent,
    CommonModule,
  ],
  templateUrl: './repos.component.html',
  styleUrl: './repos.component.css',
})
export class ReposComponent {
  userData: any = null;
  loading: boolean = false;
  activeIntegration = new FormControl('github');
  entityControl = new FormControl();
  integrations = ['github'];
  collections: string[] = [];
  selectedEntities: string = '';
  isLoading: boolean = false;
  colDefs: ColDef[] = [];
  rowData = [];
  searchText = '';
  isDataFetched: boolean = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 10;
  totalRecords = 150;

  constructor(
    private localStorage: LocalStorageService,
    private asyncHandler: AsyncHandlerService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.userData = this.localStorage.getData(ENUMS.userData);
    if (this.userData?.github) {
      this.getGithubCollections();
    }
  }

  getGithubCollections() {
    this.loading = true;
    this.asyncHandler.handleObservable(
      this.api.getData(API_URL.githubCollections),
      (data: any) => {
        if (data?.data?.collectionNames) {
          this.userData.github = data?.data?.githubData;
          this.collections = data?.data?.collectionNames || [];
          this.localStorage.setData(ENUMS.userData, this.userData);
          this.isDataFetched = true;
        }
      },
      () => {
        this.loading = false;
      }
    );
  }

  onEntityChange(event: MatSelectChange) {
    this.selectedEntities = event.value;
    this.loadEntityDetail();
  }

  generateAgGrid(data: any) {
    this.colDefs = Object.keys(data[0]).map((key) => ({
      field: key,
      filter: true,
      sortable: true,
    }));

    this.rowData = data;
    this.isLoading = false;
  }

  // Mock service method - replace with actual service call
  onSearchChange(event: KeyboardEvent) {
    this.searchText = (event.target as HTMLInputElement).value;
  }

  loadEntityDetail() {
    this.isLoading = true;
    this.asyncHandler.handleObservable(
      this.api.getData(
        `${API_URL.githubCollectionDetail}/${this.selectedEntities}?page=${this.currentPage}&limit=${this.pageSize}`
      ),
      (res: any) => {
        if (res?.data?.data?.length) {
          const { data, totalItems, totalPages: pagesCount } = res.data;
          this.generateAgGrid(data);
          console.log('Response ==>', data);
          this.totalPages = pagesCount;
          this.totalRecords = totalItems;
        } else {
          this.isLoading = false;
        }
      }
    );
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
    this.loadEntityDetail();
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadEntityDetail();
    }
  }
}
