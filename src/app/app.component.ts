import { Component } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularbootstrap';
  _authService = new AuthService;
  logged = false;
  usrinfo = null;

  ngOnInit() {
    //Toggle Click Function
    this.logged = this._authService.isAuthenticated();

    if (this.logged) {
      this.usrinfo = this._authService.getInfo();
    }

    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }

}