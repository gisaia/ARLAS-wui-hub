import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public email;
  public avatar

  @Input() public sidenav: MatSidenav;

  constructor(private authentService: AuthentificationService) { }

  public ngOnInit(): void {
    console.log(this.authentService.identityClaims);
    const claims = this.authentService.identityClaims as any;
    this.authentService.canActivateProtectedRoutes.subscribe(data =>{
      if(data){
        this.email = claims.name;
        this.avatar = claims.picture;
      }else{
        this.email = '';
        this.avatar='';
      }
    })
  }

}
