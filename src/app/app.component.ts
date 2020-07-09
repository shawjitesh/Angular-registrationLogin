import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { User } from '../user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  username: string;
}

interface Course {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: '../dialog-overview-example-dialog.html'
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClickOk(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'registrationLogin';

  constructor(public dialog: MatDialog) {}

  registrationForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    userName: new FormControl(''),
    course: new FormControl(''),
    gender: new FormControl(''),
    address: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    email: new FormControl('', [
      Validators.email
    ]),
    birthDate: new FormControl(''),
    age: new FormControl(''),
    phone: new FormControl(''),
  });

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  defaultValue;

  courses: Course[] = [
    {value: 'geology-0', viewValue: 'Geology'},
    {value: 'physiology-1', viewValue: 'Physiology'},
    {value: 'pshycology-2', viewValue: 'Pshycology'}
  ];

  registered: boolean = false;
  login: boolean = true;
  logged: boolean = true;
  logError: boolean = true;
  passwordMatch: boolean = false;
  usernameMatcher: boolean = false;

  users: User[] = [];
  usernames: string[] = [];

  onRegister() {
    if(this.registrationForm.controls['password'].value == this.registrationForm.controls['confirmPassword'].value) {
      this.registered = true;
      this.passwordMatch = false;
      let user = new User(this.registrationForm.get('userName').value, this.registrationForm.get('password').value);
      if(this.usernames.indexOf(this.registrationForm.controls['userName'].value) != -1) {
        this.usernameMatcher = true;
      } else {
        this.usernameMatcher = false;
        this.usernames.push(this.registrationForm.get('userName').value);
        this.users.push(user);
      }
    } else {
      this.registered = false;
      this.passwordMatch = true;
    }

    if(this.usernameMatcher) {
      this.registered = false;
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '250px',
        data: {username: this.registrationForm.controls['userName'].value}
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.registrationForm.controls['userName'] = result;
      });
      this.usernameMatcher = false;
    }
    console.log(this.users);
  }

  onLogin() {
    this.registered = true;
    let usernameIndex = this.users.findIndex(x => x.username == this.loginForm.controls['username'].value);
    let passwordIndex = this.users.findIndex(x => x.password == this.loginForm.controls['password'].value);
    if(usernameIndex >= 0 && passwordIndex >= 0 && usernameIndex == passwordIndex) {
      this.logError = true;
      this.logged = false;
    } else {
      this.logError = false;
      this.logged = true;
    }
    console.log(this.loginForm.value);
  }

  calculateAge(event) {
    let today: Date = new Date;
    let dob = event.value;
    let timeDiff = Math.abs(Date.now() - dob.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.registrationForm.controls['age'].setValue(age);
    console.log(age);
  }

  ngOnInit() {
    this.registrationForm.controls.proof.patchValue(this.defaultValue);
  }

  emailMatcher = new EmailErrorStateMatcher();
  passwordMatcher = new PasswordErrorStateMatcher();
}

export class EmailErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    if(control.parent.value['password'] != control.value) return true;
    return false;
  }
}