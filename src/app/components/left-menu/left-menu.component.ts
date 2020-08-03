import { Component, OnInit } from '@angular/core';
import { onSideNavChange, animateText } from './animations';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';
import { Router } from '@angular/router';

interface Page {
  link: string;
  name: string;
  icon: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {

  public sideNavState = false;
  public linkText = false;
  public connected:boolean;
  public pages: Page[]= [
    { name: 'Arlas WUI Builder', link: '/redirect', icon: 'build_circle', disabled: false }
  ];

  constructor(private authentService: AuthentificationService, private router:Router) { }

  public ngOnInit() {
    this.authentService.canActivateProtectedRoutes.subscribe(isConnected => {
        this.connected=isConnected;
    })
    
  }

  public connect(){
    if(this.connected){
      this.authentService.logout();
    }else{
      this.authentService.login();
    }
  }

  public onSidenavToggle() {
    this.sideNavState = !this.sideNavState;

    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
  }
}