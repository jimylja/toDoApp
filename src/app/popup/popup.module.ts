import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule, NgbModule
  ],
  exports: [PopupComponent]
})
export class PopupModule { }
