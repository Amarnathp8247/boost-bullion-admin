import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServicesService } from 'src/app/services/auth/auth-services.service';
import * as CryptoJS from 'crypto-js';
import { UserServicesService } from 'src/app/services/user-services/user-services.service';
import { Location } from '@angular/common'; 
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent {
  profileForm!: FormGroup;
  secretKey = '123456789';
  decryptedId: string = '';
  isDarkMode: boolean = false;
  token: any;
  createTransactionPasswordForm: FormGroup;
  changeTransactionPasswordForm: FormGroup;
  showConfirmPassword = false;
  showPrevPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private authService: UserServicesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location
  ) {

    this.createTransactionPasswordForm = this.fb.group({
      password: ['', Validators.required],
      cnfPassword: ['', Validators.required]
    });

    this.changeTransactionPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      cnfPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get the encrypted ID from query parameters
    this.route.queryParams.subscribe((params) => {
      const encryptedId = params['id'];

      if (encryptedId) {
        // Decrypt the ID
        const bytes = CryptoJS.AES.decrypt(encryptedId, this.secretKey);
        this.decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      }
    });
    // Initialize the form group with validators
    this.profileForm = this.fb.group({
      userId: [''],
      name: ['', ],
      isEmailVerified: [''],
      isMobileVerified: [''],
      isWithdrawAllowed: [''],
      isStakingAllowed: [''],
      isInternalTransferAllowed: [''],
      isReferralAllowed: [''],
      isAvailableForReward: [''],
   
    });

    // Retrieve the token and profile info
    this.token = localStorage.getItem('authToken');
    this.getProfileInfo();
  }

  goBack(): void {
    this.location.back();
    // Alternatively, use the router for specific navigation:
    // this.router.navigate(['/previous-route']);
  }

  getProfileInfo(): void {
    $('.loader').show();
    this.authService.getUserDataWithId(this.token ,this.decryptedId ).subscribe({
      next: (response) => {
        this.profileForm.patchValue({
          userId: response.data._id,
          name: response.data.name,
          isEmailVerified: response.data.isEmailVerified,
          isMobileVerified: response.data.isMobileVerified,
          isWithdrawAllowed: response.data.isWithdrawAllowed,
          isStakingAllowed: response.data.isStakingAllowed,
          isInternalTransferAllowed: response.data.isInternalTransferAllowed,
          isAvailableForReward: response.data.isAvailableForReward,
        });
        $('.loader').hide();
      },
      error: (error) => {
        this.toastr.error('Failed to load profile information', 'Error');
        $('.loader').hide();
      }
    });
  }

 // Method to handle form submission and update the profile
updateProfile(): void {
  if (this.profileForm.valid) {
    $('.loader').show();

    // Extract only the necessary fields
    const { name, email, mobile } = this.profileForm.value;
    const updatedData = { name, email, mobile }; // Create an object with only the needed fields

    this.authService.updateProfile(this.token, updatedData).subscribe({
      next: (response) => {
        this.toastr.success('Profile updated successfully!', 'Success');
        $('.loader').hide();
      },
      error: (error) => {
        this.toastr.error('Failed to update profile', 'Error');
        $('.loader').hide();
      }
    });
  } else {
    this.toastr.warning('Please fill out the form correctly', 'Warning');
  }
}


createTransactionPassword() {
  if (this.createTransactionPasswordForm.valid) {
    const createTransactionPassword = this.createTransactionPasswordForm.value;

    this.authService.createTransactionPasswordData(createTransactionPassword, this.token).subscribe({
      next: (response) => {
        this.toastr.success(response.body.message, '', {
          toastClass: 'toast-custom toast-success',
          positionClass: 'toast-bottom-center',
          closeButton: false,
          timeOut: 3000,
          progressBar: true
        });
        // Hide the form after successful creation
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error creating transaction password';
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

changeTransactionPassword() {
  if (this.changeTransactionPasswordForm.valid) {
    const changeTransactionPassword = this.changeTransactionPasswordForm.value;

    this.authService.changeTransactionPasswordData(changeTransactionPassword, this.token).subscribe({
      next: (response) => {
        this.toastr.success(response.message, '', {
          toastClass: 'toast-custom toast-success',
          positionClass: 'toast-bottom-center',
          closeButton: false,
          timeOut: 3000,
          progressBar: true
        });
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error changing transaction password';
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



}
