import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LinkVerifyService } from 'src/app/services/link-verify.service';
import { Verify } from 'src/app/services/verify.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-uservirify',
  templateUrl: './uservirify.component.html',
  styleUrls: ['./uservirify.component.scss']
})
export class UservirifyComponent implements OnInit {
  myForm!: FormGroup;
  token: string | undefined;
  passwordMismatch = false;
  encryptedView = true;
  submitDisabled = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private _VerifyEmail: Verify, private _VerifyLink: LinkVerifyService) { }
  async ngOnInit() {
    debugger;
    this.route.queryParams.subscribe(params => {
      this.token = params['id'];
    });
    console.log(this.token);
    let json = { "jsonData": JSON.stringify(this.token) };
  
    try {
      const response = await this._VerifyLink.verify(json).toPromise();
      console.log(response.flag);
      if (response.flag) {
        this.myForm = this.fb.group({
          password: ['', Validators.required],
          confirmPassword: ['', Validators.required]
        });
      } else {
        Swal.fire("ERROR", 'Link invalid', "error");
      }
    } catch (error) {
      Swal.fire("ERROR", 'API call error: '+ error, "error");
    }
  }
  handleSubmit() {
    if (this.myForm.valid && !this.submitDisabled) {
      const password = this.myForm.value.password;
      const confirmPassword = this.myForm.value.confirmPassword;

      if (password === confirmPassword) {
        const data = {
          token: this.token,
          password: password

        };
        let json = { "jsonData": JSON.stringify(data) };
        console.log(json);
        
        this._VerifyEmail.verify(json).subscribe({
          next: (res) => {
            console.log("Signup successful");
            Swal.fire("SUCCESS", 'Password applied to your account', "success");
          },
          error: (err) => {
            console.error(err);
            const errorMessage = err?.errorMessage || 'An unknown error occurred.';
            console.log(errorMessage);
          }
        });

        this.submitDisabled = true; // Disable the submit button
      } else {
        this.myForm.reset();
        this.passwordMismatch = true;
      }
    }
  }

  toggleEncryptedView() {
    this.encryptedView = !this.encryptedView;
  }
}
