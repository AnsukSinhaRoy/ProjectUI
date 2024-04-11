import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  constructor(private fb: FormBuilder, private tostr: ToastrService, private _http: HttpClient, private _AuthService: AuthService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      //fieldname:['default value', Validators.compose([validationsArray]), ]
      salutation: ['', Validators.required],
      forename: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      surname: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(/.*@gmail\.com/i)])],
      //dob:['', Validators.required],
      //countryCode:['', Validators.required],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{10}$/)])]
    })
  }

  private validateAllFormField(fg: FormGroup) 
  {
    //Object.keys(fg.controls) this returns an array
    Object.keys(fg.controls).forEach(field => {
      const control = fg.get(field);
      if (control instanceof FormControl) control.markAsDirty({ onlySelf: true });
      else if (control instanceof FormGroup) this.validateAllFormField(control);
    })
  }

  async onSubmit() 
  {
    this.tostr.toastrConfig.positionClass = 'toast-bottom-right';
    if (this.signupForm.valid) 
    {
      this._AuthService.signup(this.signupForm.value).subscribe(
        (res) => {
          console.log(res.status); // Access the value of the variable here
          Swal.fire(res.status, res.message, res.status);
        },
        (err) => {
          if (err instanceof HttpErrorResponse && err.status === 0) {
            const errorMessage = 'API is not online';
            console.error(errorMessage);
            Swal.fire('ERROR', errorMessage, 'error');
          } else {
            console.error(err);
            const errorMessage = err?.message || 'An unknown error occurred.';
            console.log(errorMessage);
            Swal.fire('ERROR', errorMessage, 'error');
          }
        }
      );
      // try 
      // {
      //   const res = await this._AuthService.signup(this.signupForm.value).toPromise();
      //   console.log(res.status);
      //   Swal.fire(res.status, res.message, res.status);
      // } 
      // catch (err: any) 
      // {
      //   if (err instanceof HttpErrorResponse && err.status === 0) 
      //   {
      //     const errorMessage = 'API is not online';
      //     console.error(errorMessage);
      //     Swal.fire('ERROR', errorMessage, 'error');
      //   } 
      //   else 
      //   {
      //     const errorMessage = err?.message || 'An unknown error occurred.';
      //     Swal.fire('ERROR', errorMessage, 'error');
      //   }
      // }

    } 
    else
    {
      this.validateAllFormField(this.signupForm);
      this.tostr.error('INVALID FORM!!')
    }
  }
}
