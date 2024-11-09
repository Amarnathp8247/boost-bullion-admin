import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { WalletServiceService } from 'src/app/services/wallet/wallet-service.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {
  depositForm: FormGroup;
  token: string | null = null;
  transactionHash: string = ''; // <-- Add this property
  qrCodeUrl: string | null = null;
  expirationMessage: string | null = null;
  depositAddress: string | null = null;
  imageShow: boolean = false
  // Timer variables
  timer: number = 15 * 60; // 15 minutes in seconds
  intervalId: any;
  buttonEnabled: boolean = true;


  constructor(
    private walletService: WalletServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.depositForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');
  }
  ngOnDestroy(): void {
    // Clear the timer when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Method to start the timer
  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.buttonEnabled = false;
        this.expirationMessage = 'Time up';
        clearInterval(this.intervalId); // Stop the timer
      }
    }, 1000); // Update every second
  }


  get minutes(): number {
    return Math.floor(this.timer / 60);  // Get full minutes from total seconds
}

get seconds(): number {
    return this.timer % 60;  // Get the remaining seconds
}




  deposit() {
    if (this.depositForm.valid) {
      const depositFormAmount = this.depositForm.value;

      this.walletService.deposit(depositFormAmount, this.token!).subscribe({
        next: (response) => {
          this.toastr.success(response.body.message, '', {
            toastClass: 'toast-custom toast-success',
            positionClass: 'toast-bottom-center',
            closeButton: false,
            timeOut: 3000,
            progressBar: true
          });
          this.imageShow = true
          // Extract data from the API response
          this.qrCodeUrl = response.body.data; // QR code image in base64 format
          this.expirationMessage = response.body.message1; // Expiry message
          this.depositAddress = response.body.depositAddress; // Deposit address
          // Start the timer for verification
          this.timer = 15 * 60; // Reset timer to 15 minutes
          this.buttonEnabled = true; // Enable the button

          // Start the timer again after a successful deposit
          if (this.intervalId) {
            clearInterval(this.intervalId); // Clear any existing interval
          }
          this.startTimer(); // Start a new timer


          this.depositForm.reset();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error validating deposit';
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

  verifyTransactionHash(transactionHash: string) {
    if (!this.token) {
      this.toastr.error('Token not found. Please log in again.', '', {
        toastClass: 'toast-custom toast-error',
        positionClass: 'toast-bottom-center',
        closeButton: false,
        timeOut: 3000,
        progressBar: true
      });
      return;
    }

    this.walletService.verifyTransactionHash(transactionHash, this.token).subscribe({
      next: (response) => {
        this.toastr.success('Transaction verified successfully.', '', {
          toastClass: 'toast-custom toast-success',
          positionClass: 'toast-bottom-center',
          closeButton: false,
          timeOut: 3000,
          progressBar: true
        });
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error verifying transaction';
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