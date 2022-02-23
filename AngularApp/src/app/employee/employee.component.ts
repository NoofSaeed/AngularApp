import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { RestfulService } from '../Services/restful.service';
import { Employee } from './employee';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
  private baseUrl = environment.baseUrl;
  NotfiyCount: any;
  employeeForm: any;
  dataSource: MatTableDataSource<Employee>;
  employeeIdUpdate = "0";
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['name', 'age', 'gender', 'Edit', 'Delete'];
  
  constructor(private formbulider: FormBuilder, private toastr: ToastrService, private employeeService: RestfulService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
   
  }

  ngOnInit() {

    this.loadAllEmployees();
    this.getNotificationCount();
    this.employeeForm = this.formbulider.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });

    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(this.baseUrl+'NotifyHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
   

    connection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on("BroadcastMessage", () => {
      this.loadAllEmployees();
      this.getNotificationCount();
      this.toastr.info("Employees data has been changed");


    });

   

   
  }

  getNotificationCount() {
    this.employeeService.url = this.baseUrl + 'api/Notifications/notificationcount';
    this.employeeService.getAll().subscribe(data => {
    this.NotfiyCount = data;
    });
  }

  loadAllEmployees() {
   this.employeeUrl();
   this.employeeService.getAll().subscribe(data => {
   this.dataSource = new MatTableDataSource(data);
    });
  }

  onFormSubmit() {
    const employee = this.employeeForm.value;
    this.createEmployee(employee);
    this.employeeForm.reset();
  }

  loadEmployeeToEdit(employeeId: string) {
    this.employeeUrl();
    this.employeeService.getById(employeeId).subscribe(employee => {
      this.employeeIdUpdate = employee.id;
      this.employeeForm.controls['name'].setValue(employee.name);
      this.employeeForm.controls['gender'].setValue(employee.gender);
      this.employeeForm.controls['age'].setValue(employee.age);
    });

  }

  employeeUrl() {
    this.employeeService.url = this.baseUrl + 'api/Employees';
  }

  createEmployee(employee: Employee) {
    this.employeeUrl();
    if (this.employeeIdUpdate != "0") {
      employee.id=this.employeeIdUpdate;

      this.employeeService.update(employee.id, employee).subscribe(
        () => {
          this.savedSuccessful(1);
          this.loadAllEmployees();
          this.employeeIdUpdate = "0";
          this.employeeForm.reset();
        }
      );
    } else {

      this.employeeService.create(employee).subscribe(() => {
        this.savedSuccessful(0);
        this.loadAllEmployees();
        this.employeeIdUpdate = "0";
        this.employeeForm.reset();
     
      });
    }
  }

  deleteEmployee(employeeId: string) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.employeeUrl();
      this.employeeService.delete(employeeId).subscribe(() => {
        this.savedSuccessful(2);
        this.loadAllEmployees();
        this.employeeIdUpdate = "0";
        this.employeeForm.reset();

      });
    }

  }

  resetForm() {
    this.employeeForm.reset();
    this.loadAllEmployees();
  }

  savedSuccessful(isUpdate) {
    switch (isUpdate) {
      case 0:
        {
        this._snackBar.open('Record Added Successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        break;
      }
      case 1:
        {
        this._snackBar.open('Record Updated Successfully!', 'Close', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        break;
      }
      case 2:
        {
          this._snackBar.open('Record Deleted Successfully!', 'Close', {
            duration: 2000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          break;
        }
      
    }
   
  }
}
