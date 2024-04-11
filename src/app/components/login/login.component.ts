import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/services/login-service.service';
import { SmartLoginService } from 'src/app/services/smart-login.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //name of the form is "loginForm" - next step is to innitialize it in the ngOnInit
  loginForm!: FormGroup;
  rememberMe: boolean = false;
  constructor(private fb: FormBuilder, private _login: LoginServiceService, private http: HttpClient, private router: Router, private _smartlogin: SmartLoginService) { }

  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    })
    fetch("https://localhost:7197/api/userControllerAPI/smartLogin", {
    method: "get",
    headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
    }),
})
    .then((response) => response.json())
    .then((response) => {
        if (response.flag) {
            const { Link } = JSON.parse(response.returnJson);
            console.log(Link);
            window.location.href = Link;
        }
    })

      .catch((err) => {
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
      });
  }

  async onSubmit() {
    
    this.rememberMe = this.loginForm.get('rememberMe')?.value;
    console.log(this.rememberMe);
    debugger
    if (this.loginForm.valid) {
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rem: this.rememberMe
      };
      console.log(data);
      let json = { "jsonData": JSON.stringify(data) };
      console.log(json);
      this._login.verify(json).subscribe(
        (res) => {
          if (res.flag) {
            const { Link } = JSON.parse(res.returnJson);
            window.location.href = Link;
            //this.router.navigateByUrl(Link);
            //Swal.fire(res.status, res.message, res.status);
          }
          else Swal.fire(res.status, res.message, res.status);
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
    else {
      this.validateAllFormField(this.loginForm);
    }
  }

  private validateAllFormField(fg: FormGroup) {
    Object.keys(fg.controls).forEach(field => {
      const control = fg.get(field);
      if (control instanceof FormControl) control.markAsDirty({ onlySelf: true });
      else if (control instanceof FormGroup) this.validateAllFormField(control);
    })
  }

}


