import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserModel } from './user-dashboard.model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {

  formValue!: FormGroup;
  userModelObj: UserModel = new UserModel()
  allUsers: any;
  showAdd : boolean | undefined;
  showUpdate : boolean | undefined 
  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      username: [''],
      email: [''],
      phoneno: ['']
    });
    this.getAllUser()
  }

  //Which button displaying when 
  clickAddUser(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  //Adding Users Operation
  postUserDetails() {
    this.userModelObj.name = this.formValue.value.username;
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.phone = this.formValue.value.phoneno;
    console.log(this.userModelObj)
    if (this.formValue.value.username === null || this.formValue.value.email === null || this.formValue.value.phone === null) {
      alert('Please fill up the form before submitting')
    } else {
      this.apiService.postUser(this.userModelObj)
        .subscribe({
          next: (res) => {
            console.log(res)
            alert("Data added successfully")
            this.getAllUser()
          },
          error: (err) => {
            console.log(err)
            alert("Something went wrong")
          }
        });
    }
  }

  //Clearing the form
  clear() {
    this.formValue.reset();
  }

  //Displaying All Users Operation
  getAllUser() {
    this.apiService.getUser().subscribe({
      next: (response) => {
        this.allUsers = response
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //Delete Operation
  deleteById(row: any) {
    this.apiService.deleteUser(row.id).subscribe({
      next: (response) => {
        console.log(response);
        alert("Delete Success")
        //window.location.reload();
        this.getAllUser()
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  //Displaying details in form
  onEdit(row:any){
    console.log(row);
    this.showAdd = false;
    this.showUpdate = true;
    this.userModelObj.id = row.id;
    this.formValue.controls['username'].setValue(row.name);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['phoneno'].setValue(row.phone);
  }

  //Update User Details
  updateUserDetails(){
    this.userModelObj.name = this.formValue.value.username;
    this.userModelObj.email = this.formValue.value.email;
    this.userModelObj.phone = this.formValue.value.phoneno;
    console.log(this.userModelObj)
    if (this.formValue.value.username === null || this.formValue.value.email === null || this.formValue.value.phone === null || this.userModelObj.id === 0) {
      alert('Please add the details first')
    } else {
      this.apiService.updateUser(this.userModelObj,this.userModelObj.id).subscribe({
        next:(response)=>{
          alert("Update Successfully")
          this.getAllUser()
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }
}
