import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LogoutService } from 'src/app/services/logout.service';
import { UpdateUserService } from 'src/app/services/update-user.service';
import Swal from 'sweetalert2';

interface Ticket {
  raiseDate: string;
  customerName: string;
  ticketID: string;
  sla: string;
  machine: string;
  description: string;
  status: string; // Add the ticket status property
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  profileModal = false;
  tidketModal = false;
  emailValue = 'example@example.com';
  firstName = 'First Name';
  lastName = 'Last Name';
  phoneNumber = 'Phone Number';
  address = localStorage.getItem("address") || "null";
  token: string | undefined;
  inputElement: HTMLInputElement | null = null;
  blurEventListener: (() => void) | null = null;

  activeTicketsFlag: boolean = false;
  closedTicketsFlag: boolean = false;
  allTicketsFlag: boolean = false;
  category: string = 'All Tickets';
  activeTab: string = ''; // Initialize the active tab to 'all'
  tickets: Ticket[] = [];
  opentickets: Ticket[] = [];
  closetickets: Ticket[] = [];
  Alltickets: Ticket[] = [];
  selectedTicket: Ticket | null = null; // Initialize as null
  editCloseOPT: boolean = false;
  closeOPTInput: string = '';

  constructor(private elementRef: ElementRef, private route: ActivatedRoute, private _VerifyLink: DashboardService, private _update: UpdateUserService, private _logout: LogoutService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['id'];
    });
    let json = { "jsonData": JSON.stringify(this.token) };
    try {
      const response = await this._VerifyLink.access(json).toPromise();
      if (response.flag) {

        const { Email, FirstName, PhoneNumber, LastName, Address } = JSON.parse(response.returnJson);
        this.emailValue = Email;
        this.firstName = FirstName;
        this.lastName = LastName;
        this.phoneNumber = PhoneNumber;
        this.address = Address;
      }
      else {
        Swal.fire(response.status, response.message, response.status);
        window.location.href = "/";
      }
    } catch (error) {
      Swal.fire("ERROR", 'API call error: ' + error, "error");
    }
    json = { jsonData: JSON.stringify(this.token) };
    this._VerifyLink.getTicket(json).subscribe(
      (data) => {
        console.log(data);
        this.Alltickets = data;
        console.log(data);
        this.opentickets = data.filter((ticket: Ticket) => ticket.status === 'Active');
        this.closetickets = data.filter((ticket: Ticket) => ticket.status === 'Closed');
      },
      (error) => {
        console.error('Error fetching Ticket:', error);
      }
    );
  }

  fetchAllTickets(): void {
    if (this.activeTab === 'active') {
      this.tickets = this.opentickets;
    } else if (this.activeTab === 'closed') {
      this.tickets = this.closetickets;
    } else {
      this.tickets = this.Alltickets;
    }
  }
  submitCloseOPT() {
    const id = this.selectedTicket?.ticketID || "null";
    const otp = this.closeOPTInput;
    this._VerifyLink.close(id, otp).subscribe(
      (res) => {
        Swal.fire(res.status, res.message, res.status);
      },
      (err) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          const errorMessage = 'API is not online';
          console.error(errorMessage);
          Swal.fire('ERROR', errorMessage, 'error');
        }
        else {
          console.error(err);
          const errorMessage = err?.message || 'An error unknown occurred.';
          console.log(errorMessage);
          Swal.fire('ERROR', errorMessage, 'error');
        }
      }
    );
    this.closeOPTInput = '';
    this.editCloseOPT = false;
  }
  details(id: string): void {
    const ticket = this.tickets.find(ticket => ticket.ticketID === id);
    if (ticket) {
      this.selectedTicket = ticket;
      this.tidketModal = true;
    }
  }


  async openModal() {
    this.profileModal = true;
  }

  closeModal() {
    this.profileModal = false;
    if (this.inputElement) {
      this.convertInputToDisplay('');
    }
    this.tidketModal = false;
  }



  update() {
    if (this.inputElement) {
      this.convertInputToDisplay('');
    }
    const data = {
      token: this.token,
      fname: this.firstName,
      lname: this.lastName,
      phone: this.phoneNumber,
      address: this.address
    };
    let json = { "jsonData": JSON.stringify(data) };
    console.log(json);

    this._update.verify(json).subscribe(
      (res) => {
        Swal.fire(res.status, res.message, res.status);
      },
      (err) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          const errorMessage = 'API is not online';
          console.error(errorMessage);
          Swal.fire('ERROR', errorMessage, 'error');
        }
        else {
          console.error(err);
          const errorMessage = err?.message || 'An error unknown occurred.';
          console.log(errorMessage);
          Swal.fire('ERROR', errorMessage, 'error');
        }
      }
    );


  }

  editEmail(event: MouseEvent) {
    event.stopPropagation();
    // Email is non-editable, so no edit function is needed for it
  }

  editFirstName(event: MouseEvent) {
    this.editField('firstName', event);
  }

  editaddress(event: MouseEvent) {
    this.editField('address', event);
  }

  editLastName(event: MouseEvent) {
    this.editField('lastName', event);
  }

  editPhoneNumber(event: MouseEvent) {
    this.editField('phoneNumber', event);
  }

  editField(field: string, event: MouseEvent) {
    event.stopPropagation();

    const fieldElement = this.elementRef.nativeElement.querySelector(`#${field}`);
    if (fieldElement instanceof HTMLSpanElement) {
      const fieldValue = fieldElement.innerText;

      this.inputElement = document.createElement('input');
      this.inputElement.type = 'text';
      this.inputElement.value = fieldValue;
      this.inputElement.classList.add('edit-input');

      fieldElement.parentNode?.replaceChild(this.inputElement, fieldElement);
      this.inputElement.focus();

      this.blurEventListener = () => {
        this.convertInputToDisplay(field);
      };

      this.inputElement.addEventListener('blur', this.blurEventListener);
    }
  }
  showActiveTickets(): void {
    this.activeTicketsFlag = true;
    this.closedTicketsFlag = false;
    this.allTicketsFlag = false;
    this.activeTab = 'active';
    this.category = 'Active Tickets';
    this.fetchAllTickets();
  }

  showClosedTickets(): void {
    this.activeTicketsFlag = false;
    this.closedTicketsFlag = true;
    this.allTicketsFlag = false;
    this.activeTab = 'closed';
    this.category = 'Closed Tickets';
    this.fetchAllTickets();
  }

  showAllTickets(): void {
    this.activeTicketsFlag = false;
    this.closedTicketsFlag = false;
    this.activeTab = 'all';
    this.allTicketsFlag = true;
    this.fetchAllTickets();
  }


  convertInputToDisplay(field: string) {
    if (this.inputElement) {
      const displayElement = document.createElement('span');
      displayElement.id = field;
      displayElement.innerText = this.inputElement.value;
      this.inputElement.parentNode?.replaceChild(displayElement, this.inputElement);

      // Update the variable values based on the field
      if (field === 'emailValue') {
        this.emailValue = this.inputElement.value;
      } else if (field === 'firstName') {
        this.firstName = this.inputElement.value;
      } else if (field === 'lastName') {
        this.lastName = this.inputElement.value;
      } else if (field === 'phoneNumber') {
        this.phoneNumber = this.inputElement.value;
      }

      // Adjusted type to HTMLInputElement
      this.inputElement = null as unknown as HTMLInputElement;

      if (this.blurEventListener) {
        // Call removeEventListener on this.inputElement (HTMLInputElement)
        this.inputElement.removeEventListener('blur', this.blurEventListener);
        this.blurEventListener = null;
      }
    }
  }
  logout() {
    debugger
    this.route.queryParams.subscribe(params => {
      this.token = params['id'];
    });
    let json = { "jsonData": JSON.stringify(this.token) };
    console.log(json)
    debugger
    this._logout.logout(json).subscribe(
      (res) => {

      },
      (err) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          const errorMessage = 'API is not online';
          console.error(errorMessage);
          Swal.fire('ERROR', errorMessage, 'error');
        }
        else {
          console.error(err);
          const errorMessage = err?.message || 'An unknown error occurred.';
          console.log(errorMessage);
          Swal.fire('ERROR', errorMessage, 'error');
        }
      }
    );

    window.location.href = "http://localhost:4200/";
  }
}