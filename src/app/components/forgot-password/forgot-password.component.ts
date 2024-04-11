import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ForgotpasswordService } from 'src/app/services/forgotpassword.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpassword!: FormGroup

  constructor(private fb: FormBuilder,private _forgot: ForgotpasswordService ) { }

  ngOnInit(): void {
    this.forgotpassword = this.fb.group({
      email: ['']
    })
  }
  submit()
  {
    
    console.log(this.forgotpassword.value.email);
    let json = { "jsonData": JSON.stringify(this.forgotpassword.value) };
      console.log(json);
      debugger
      this._forgot.forgotpass(json).subscribe(
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
            const errorMessage = err?.message || 'An unknown error occurred.';
            console.log(errorMessage);
            Swal.fire('ERROR', errorMessage, 'error');
          }
        }
      );
  }

}
