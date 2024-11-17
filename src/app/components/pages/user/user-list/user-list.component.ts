import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionServicesService } from '../../../../services/transaction/transaction-services.service';
import { PageEvent } from '@angular/material/paginator';
import { UserServicesService } from 'src/app/services/user-services/user-services.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  transactions: any[] = [];
  error: string | null = null;
  token: any;
  totalCredited: number = 0;
  totalDebited: number = 0;
  totalTransactions: number = 0; // total transactions for paginator
  pageSize: number = 10;
  currentPage: number = 1;
  filteredTransactions: any[] = []; // Store filtered transactions
  // Filter properties
  transactionType: string = '';
  status: string = '';
  startDate: string = '';
  endDate: string = '';
  secretKey = '123456789';

  constructor(private UserServicesServices: UserServicesService, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    this.userList(this.currentPage, this.pageSize);
  }

  userList(page: number, size: number): void {
    $('.loader').show();
    // Construct parameters object
    const params: any = {
      page: page.toString(),
      sizePerPage: size.toString(),
    };

    // Add filtering parameters only if they have values
    if (this.transactionType) {
      params.transactionType = this.transactionType;
    }
    if (this.status) {
      params.status = this.status;
    }
    if (this.startDate) {
      params.startDate = this.startDate;
    }
    if (this.endDate) {
      params.endDate = this.endDate;
    }

    this.UserServicesServices.getUserList(page, size, this.token!, params).subscribe({
      next: (response: any) => {
        this.transactions = response.data.docs;
        this.filteredTransactions = [...this.transactions]; // Initialize filtered transactions
        this.totalTransactions = response.data.totalDocs; // total count for pagination
        this.calculateTotals(); // Calculate totals when transactions are fetched
        $('.loader').hide();
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        $('.loader').hide();
      }
    });
  }

  getFreeraTree(id: any) {
    // Encrypt the ID
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), this.secretKey).toString();

    // Navigate to the next component with the encrypted ID
    this.router.navigate(['/reffral-tree'], { queryParams: { id: encryptedId } });


  }

  updateUser(id: any) {
    // Encrypt the ID
    const encryptedId = CryptoJS.AES.encrypt(id.toString(), this.secretKey).toString();

    // Navigate to the next component with the encrypted ID
    this.router.navigate(['/update-user'], { queryParams: { id: encryptedId } });


  }


  applyFilters(): void {
    // Reset current page to 1 when applying new filters
    this.currentPage = 1;
    // Call fetchTransactions with updated filters
    this.userList(this.currentPage, this.pageSize);
  }


  calculateTotals(): void {
    this.totalCredited = this.transactions
      .filter(transaction => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    this.totalDebited = this.transactions
      .filter(transaction => transaction.amount < 0)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  }


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator pageIndex starts from 0
    this.pageSize = event.pageSize;
    this.userList(this.currentPage, this.pageSize);
  }
}

