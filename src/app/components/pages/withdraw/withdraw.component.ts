import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {

  withdrawForm: FormGroup;
  token: any;
  showWithdrawPassword = false;

  page = 1;
  sizePerPage = 10;
  transactionType = 'WITHDRAW';
  transactions: any = [];
  totalTransactions: number = 0; 


  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder, // Inject FormBuilder
    @Inject(ToastrService) private toastr: ToastrService
  ) {
    // Initialize the form groups in the constructor
    
    this.withdrawForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required]],
    });
   
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
    // this.fetchWalletTransactions(this.page, this.sizePerPage);
  }

  withdraw() {
    if (this.withdrawForm.valid) {
      const withdrawAmount = this.withdrawForm.value; // Get the value from the form
      // const withdrawPassword = this.withdrawForm.value.withdrawPassword; // Get the password from the form

      this.walletService.withdraw(withdrawAmount, this.token).subscribe({
        next: (response) => {
          this.toastr.success(response.message, '', {
            toastClass: 'toast-custom toast-success',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });

          this.withdrawForm.reset();
          // this.fetchWalletTransactions(this.page, this.sizePerPage);
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error validating referral code';
        
          this.toastr.error(errorMessage, '', {
            toastClass: 'toast-custom toast-error',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
        }
      });
    }
  }
  
  // fetchWalletTransactions(page: number, sizePerPage: number) {
  //   if (this.token) {
  //     this.walletService.getWalletTransactions(page, sizePerPage, this.transactionType, this.token).subscribe({
  //       next: (response) => {
  //         this.transactions = response.data.docs; // Adjust based on your response structure
  //         this.totalTransactions = response.total; // Assuming your response contains the total transaction count
  //         console.log(this.transactions);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching wallet transactions:', error);
  //       }
  //     });
  //   }
  // }

  // onPageChange(event: PageEvent): void {
  //   this.page = event.pageIndex + 1; // MatPaginator pageIndex starts from 0
  //   this.sizePerPage = event.pageSize;
  //   this.fetchWalletTransactions(this.page, this.sizePerPage);
  // }

  
}
