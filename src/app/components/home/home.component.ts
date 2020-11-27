import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public _requests: RequestsService
  ) { }

  ngOnInit(): void {
    this._requests.getOKServer().subscribe(
      (response: any) => {
        debugger;
      },
      (error) => {
      }
    )
  }

}
