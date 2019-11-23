import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEventComponent } from './add-event.component';



@NgModule({
  declarations: [AddEventComponent],
  imports: [
    CommonModule
  ],
  exports: [AddEventComponent]
})
export class AddEventModule { }
