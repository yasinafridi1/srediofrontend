import { NgForOf, NgIf } from '@angular/common';
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
// Register the required modules
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type {
  ColDef,
  GetDetailRowDataParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SizeColumnsToFitGridStrategy,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';

import {
  AllCommunityModule,
  ModuleRegistry,
  ClientSideRowModelModule,
} from 'ag-grid-community';
import { GridLoaderComponent } from '../../Components/Loader/grid-loader/grid-loader.component';
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);
@Component({
  selector: 'app-repos',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatProgressSpinnerModule,
    NgIf,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgForOf,
    AgGridAngular,
    GridLoaderComponent,
  ],
  templateUrl: './repos.component.html',
  styleUrl: './repos.component.css',
})
export class ReposComponent {
  userData: any = null;
  loading: boolean = false;
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  activeIntegration = new FormControl('github');
  entityControl = new FormControl();
  integrations = ['github'];
  collections: string[] = [];
  selectedEntities: string = '';
  isLoading: boolean = false;
  colDefs: ColDef[] = [];
  rowData = [];
  searchText = '';
  public pagination = true;
  public paginationPageSize = 20;
  public paginationAutoPageSize = true;
  isDataFetched: boolean = false;
  totalRecords: number = 0;
  currentPage: number = 1;
  paginationPageSizeSelector = [2, 10, 20, 25];
  private gridApi!: GridApi;

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

  onPaginationChanged(event: any) {
    const { newPage, newPageSize } = event;
    if (newPageSize) {
      this.paginationPageSize = this.gridApi.paginationGetPageSize();
    }
    if (newPage) {
      this.currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    }
  }

  loadEntityDetail() {
    this.isLoading = true;
    this.asyncHandler.handleObservable(
      this.api.getData(
        `${API_URL.githubCollectionDetail}/${this.selectedEntities}?page=${this.currentPage}&limit=${this.paginationPageSize}`
      ),
      (res: any) => {
        if (res?.data?.data?.length) {
          this.gridApi.setRowCount(100, false);
          this.generateAgGrid(res.data.data);
          console.log(res.data);
        } else {
          this.isLoading = false;
        }
      }
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    console.log('Grid API:', this.gridApi);
  }
}
