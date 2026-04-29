import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DemoPageComponent } from './components/demo-page/demo-page.component';
import { ValidationService } from './services/validation.service';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    DemoPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ValidationService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }