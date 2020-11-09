import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthentificationService } from 'arlas-wui-toolkit/services/authentification/authentification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  @Input() public sidenav: MatSidenav;

  constructor(private authentService: AuthentificationService) { }

  public ngOnInit(): void {
  }

}
