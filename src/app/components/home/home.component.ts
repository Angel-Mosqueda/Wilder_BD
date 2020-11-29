import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  autenticado: boolean = false;

  constructor(
    public _requests: RequestsService,
    protected _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.autenticado = this._auth.isAuthenticated();
    this._requests.getOKServer().subscribe(
      (response: any) => {
        debugger;
      },
      (error) => {
      }
    )
  }

}
