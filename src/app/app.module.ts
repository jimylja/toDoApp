import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventComponent } from './event-list/event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { PopupModule } from './popup/popup.module';
import { HttpInterceptorService } from './services/http-interceptor.service';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/app.reducer';
import { AppEffects } from './state/app.effects';

import * as Hammer from 'hammerjs';
import { AddEventComponent } from './add-event/add-event.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { environment } from '../environments/environment';
import { SwitcherComponent } from './switcher/switcher.component';
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
    press: { time: 1000 }
  } as any;
}

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EventListComponent,
    EventComponent,
    FooterComponent,
    AddEventComponent,
    AddCategoryComponent,
    SwitcherComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule, ReactiveFormsModule,
    PopupModule,
    StoreModule.forRoot({app: reducer}),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument(({
      name: 'TodoApp',
      maxAge: 25,
      logOnly: environment.production
    }))
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
