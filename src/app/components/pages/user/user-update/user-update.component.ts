import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServicesService } from 'src/app/services/auth/auth-services.service';
import * as CryptoJS from 'crypto-js';
import { UserServicesService } from 'src/app/services/user-services/user-services.service';
import { TreeNode } from 'primeng/api'; // Import TreeNode from PrimeNG
import { Location } from '@angular/common';
interface TreCustomTreeNode extends TreeNode {
  label: string;
  referralCode?: string;  // Add referralCode property to the node
  children: TreeNode[];
  icon?: string;  // Add the icon property
}
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent {

  activeSection: string = 'profile'; // Default section
  profileForm!: FormGroup;
  secretKey = '123456789';
  decryptedId: string = '';
  isDarkMode: boolean = false;
  token: any;
  changeTraxPassword: FormGroup;
  chnageLoginPassword: FormGroup;
  showConfirmPassword = false;
  showPrevPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;
  showPassword = false;
  selectedReferral: any
  nodes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: UserServicesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private location: Location
  ) {

    this.changeTraxPassword = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.chnageLoginPassword = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
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
      name: ['',],
      isEmailVerified: [''],
      isMobileVerified: [''],
      isWithdrawAllowed: [''],
      isStakingAllowed: [''],
      isInternalTransferAllowed: [''],
      // isReferralAllowed: [''],
      isAvailableForReward: [''],

    });

    // Retrieve the token and profile info
    this.token = localStorage.getItem('authToken');
    this.getProfileInfo();
    this.getRefrralTreeData()
  }

  goBack(): void {
    this.location.back();
    // Alternatively, use the router for specific navigation:
    // this.router.navigate(['/previous-route']);
  }

  getProfileInfo(): void {
    $('.loader').show();
    this.authService.getUserDataWithId(this.token, this.decryptedId).subscribe({
      next: (response) => {
        this.profileForm.patchValue({
          userId: response.data._id,
          name: response.data.name,
          isEmailVerified: response.data.isEmailVerified,
          isMobileVerified: response.data.isMobileVerified,
          isWithdrawAllowed: response.data.isWithdrawAllowed,
          isStakingAllowed: response.data.isStakingAllowed,
          isInternalTransferAllowed: response.data.isInternalTransferAllowed,
          // isReferralAllowed:response.data.isReferralAllowed,
          isAvailableForReward: response.data.isAvailableForReward,
        });
        this.chnageLoginPassword.patchValue({
          userId: response.data._id,

        })
        this.changeTraxPassword.patchValue({
          userId: response.data._id,

        })
        $('.loader').hide();
      },
      error: (error) => {
        this.toastr.error('Failed to load profile information', 'Error');
        $('.loader').hide();
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Method to handle form submission and update the profile
  updateProfile(): void {
    if (this.profileForm.valid) {
      // Show loader
      $('.loader').show();
  
      // Extract only the necessary fields
      const updatedData = this.profileForm.value;
  
      // Call the update profile service
      this.authService.updateProfile(this.token, updatedData).subscribe({
        next: (response) => {
          this.toastr.success('Profile updated successfully!', 'Success');
          $('.loader').hide();
        },
        error: (error) => {
          console.error('Profile update error:', error);
          this.toastr.error('Failed to update profile. Please try again later.', 'Error');
          $('.loader').hide();
        },
        complete: () => {
          // Additional actions if needed after the request is complete
        }
      });
    } else {
      this.toastr.warning('Please fill out the form correctly.', 'Warning');
    }
  }
  


  changeTranxPassword() {
    if (this.changeTraxPassword.valid) {
      const createTransactionPassword = this.changeTraxPassword.value;

      this.authService.changeTranxPawword(createTransactionPassword, this.token).subscribe({
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

  changeUserLoginPassword() {
    if (this.chnageLoginPassword.valid) {
      const chnageLoginPassword = this.chnageLoginPassword.value;

      this.authService.changeLoginPassword(chnageLoginPassword, this.token).subscribe({
        next: (response) => {
          this.toastr.success(response.body.message, '', {
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

  getRefrralTreeData() {

    this.authService.getReferralList(this.token, this.decryptedId).subscribe({
      next: (apiResponse) => {
        this.nodes = this.transformDataToTree(apiResponse.data);
      },
      error: (err) => {

      }

    })

  }

  transformDataToTree(data: any): TreCustomTreeNode[] {
    const nodes: TreCustomTreeNode[] = [];

    // Loop through the data entries
    for (const [key, value] of Object.entries(data)) {
      // Create a node for each entry
      const node: TreCustomTreeNode = {
        label: key,  // Set the label of the node (e.g., Prakash kumar-R8XXYM0C- Total Team : 36)
        referralCode: key.split('-')[1],  // Extract the referral code (e.g., R8XXYM0C)
        children: [],  // Initialize an empty children array
        icon: 'pi pi-user'  // Set a default icon (you can customize this logic)
      };

      // If there are child nodes (nested data), recursively transform them
      if (value && typeof value === 'object') {
        node.children = this.transformDataToTree(value);  // Recursively handle nested data
      }

      // Push the node to the nodes array
      nodes.push(node);
      console.log("the node data is", nodes);

    }

    return nodes;  // Return the transformed tree nodes
  }



  onNodeSelect(event: any): void {
    console.log("Node clicked:", event);  // Access the node data using event.node

    const node = event.node;  // Get the clicked node from event.node
    if (node) {
      this.getReferralInfo(node.referralCode);  // Fetch referral info using referralCode
    }
  }
  doSomething(event: any, item: any) {
    event.stopPropagation();
    // as before you had
  }

  getReferralInfo(referralCode: string): void {
    this.authService.getReferralInfomation(referralCode, this.token).subscribe({
      next: (response: any) => {
        this.selectedReferral = response.data

        console.log('Referral Info:', response.data);
        // Process the referral information as needed
      },
      error: (err) => {
        console.error('Failed to retrieve referral info', err);
        this.toastr.error('Failed to retrieve referral data');
      }
    });
  }

}
