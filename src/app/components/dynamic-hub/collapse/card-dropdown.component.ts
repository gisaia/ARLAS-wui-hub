import { Component, Input, Renderer2 } from '@angular/core';

@Component({
  selector: '[card-dropdown]',
  templateUrl: './card-dropdown.component.html',
  styles: ['.dynamic-collapse{height: 30px;width: 30px;line-height: 30px;}'],
})
export class CardDropdownComponent {
    @Input('card-dropdown') public collapsableElement: HTMLElement;
    public display = true;
  constructor(private _r: Renderer2) { }

  collapse() {
      this.display = !this.display;
      if(this.display){
          this._r.removeStyle(this.collapsableElement, 'display');
      } else {
          this._r.setStyle(this.collapsableElement, 'display', 'none');
      }
    }
}
