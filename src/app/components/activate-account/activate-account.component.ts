import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LinkVerifyService } from 'src/app/services/link-verify.service';
import { Verify } from 'src/app/services/verify.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  
  myForm!: FormGroup;
  token: string | undefined;
  passwordMismatch = false;
  encryptedView = false;
  submitDisabled = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private _VerifyEmail: Verify, private _VerifyLink: LinkVerifyService) { }

  ngOnInit(): void 
  {
    
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
            Swal.fire("SUCCESS", 'Your Account is Activated', "success");
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
