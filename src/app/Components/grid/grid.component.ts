import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { GridLoaderComponent } from '../Loader/grid-loader/grid-loader.component';
import { ApiService } from '@Services/api.service';
import { AsyncHandlerService } from '@Services/async-handler.service';
import { API_URL } from '@Constants/index';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import {
  AllCommunityModule,
  ModuleRegistry,
  ClientSideRowModelModule,
  themeBalham,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-grid',
  imports: [
    NgFor,
    NgIf,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    GridLoaderComponent,
    AgGridAngular,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
})
export class GridComponent {
  activeIntegration = new FormControl('AirTable');
  entityControl = new FormControl();
  integrations = ['AirTable'];
  collections: string[] = [];
  selectedCollection: string = '';
  loader: boolean = true;
  gridLoader: boolean = false;
  theme = themeBalham;
  colDefs: ColDef[] = [];
  rowData = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;

  constructor(
    private api: ApiService,
    private asyncHandler: AsyncHandlerService
  ) {}

  ngOnInit() {
    this.getAllCollections();
  }

  getAllCollections() {
    this.loader = true;
    this.asyncHandler.handleObservable(
      this.api.getData(API_URL.airtableCollections),
      (res: any) => {
        if (res?.data?.collectionNames?.length) {
          this.collections = res?.data?.collectionNames;
        }
      },
      () => {
        this.loader = false;
      }
    );
  }

  onEntityChange(event: MatSelectChange) {
    this.selectedCollection = event.value;
    this.getCollectionData();
  }

  generateAgGrid(data: any) {
    this.colDefs = Object.keys(data[0]).map((key) => {
      return {
        field: key,
        filter: true,
        sortable: true,
      };
    });
    this.rowData = data;
    this.gridLoader = false;
  }

  getCollectionData() {
    this.gridLoader = true;
    this.asyncHandler.handleObservable(
      this.api.getData(
        `${API_URL.airTableCollectionData}/${this.selectedCollection}?page=${this.currentPage}&limit=${this.pageSize}`
      ),
      (res: any) => {
        if (res?.data?.data?.length) {
          const { data, totalItems, totalPages: pagesCount } = res.data;
          this.generateAgGrid(data);
          this.totalPages = pagesCount;
          this.totalRecords = totalItems;
        } else {
          this.rowData = []; // Clear old data
          this.colDefs = []; // Clear old columns
          this.totalPages = 0;
          this.totalRecords = 0;
          this.gridLoader = false;
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
    this.getCollectionData();
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCollectionData();
    }
  }
}
