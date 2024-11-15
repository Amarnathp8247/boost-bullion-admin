import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthServicesService } from 'src/app/services/auth/auth-services.service';
import { TreeNode } from 'primeng/api'; // Import TreeNode from PrimeNG
import { UserServicesService } from 'src/app/services/user-services/user-services.service';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common'; 
interface TreCustomTreeNode extends TreeNode {
  label: string;
  referralCode?: string;  // Add referralCode property to the node
  children: TreeNode[];
  icon?: string;  // Add the icon property
}
@Component({
  selector: 'app-reffral-tree',
  templateUrl: './reffral-tree.component.html',
  styleUrls: ['./reffral-tree.component.scss']
})
export class ReffralTreeComponent {
  secretKey = '123456789';
  decryptedId: string = '';
  token: any;
  nodes: any[] = [];
  selectedReferral: any 
  constructor(private UserServicesServices: UserServicesService,
    private toastr: ToastrService,private route: ActivatedRoute , private location: Location) {

  }

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken');

    // Get the encrypted ID from query parameters
    this.route.queryParams.subscribe((params) => {
      const encryptedId = params['id'];

      if (encryptedId) {
        // Decrypt the ID
        const bytes = CryptoJS.AES.decrypt(encryptedId, this.secretKey);
        this.decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      }
    });
    this.getRefrralTreeData()

  }



  goBack(): void {
    this.location.back();
    // Alternatively, use the router for specific navigation:
    // this.router.navigate(['/previous-route']);
  }

  getRefrralTreeData() {

    this.UserServicesServices.getReferralList(this.token , this.decryptedId).subscribe({
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
      console.log("the node data is" ,nodes );
      
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
  doSomething(event:any, item:any){      
    event.stopPropagation();
    // as before you had
 }

  getReferralInfo(referralCode: string): void {
    this.UserServicesServices.getReferralInfomation(referralCode, this.token).subscribe({
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

