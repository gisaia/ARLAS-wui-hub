import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public navigate(type: string) {
    let url: string;
    switch (type) {
      case 'ais':
        url = 'http://demo.arlas.io/arlaswui-ais/';
        break;
      case 'soccer':
        url = 'http://demo.arlas.io/arlaswui-soccer/?extend=-0.6555999803812824,-0.1317739929292543,1.0967193555630672,0.7649621970677316';
        break;
      case 'pollution':
        url = 'http://demo.arlas.io/arlaswui-openaq';
        break;
    }
    window.open(url, '_blank');
  }

}
