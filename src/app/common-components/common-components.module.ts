import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TestInfoCardsComponent} from './test-info-cards/test-info-cards.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {AppRoutingModule} from '../app-routing.module';
import { PassTestButtonComponent } from './pass-test-button/pass-test-button.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
  ],
  exports: [TestInfoCardsComponent, ErrorPageComponent, PassTestButtonComponent],
  declarations: [TestInfoCardsComponent, ErrorPageComponent, PassTestButtonComponent]
})
export class CommonComponentsModule { }