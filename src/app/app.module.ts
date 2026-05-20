import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DemoPageComponent } from './components/demo-page/demo-page.component';
import { FieldRendererComponent } from './components/dynamic-form/fields/field-renderer/field-renderer.component';
import { TextFieldComponent } from './components/dynamic-form/fields/text-field/text-field.component';
import { PhoneFieldComponent } from './components/dynamic-form/fields/phone-field/phone-field.component';
import { PasswordFieldComponent } from './components/dynamic-form/fields/password-field/password-field.component';
import { EmailFieldComponent } from './components/dynamic-form/fields/email-field/email-field.component';
import { TextareaFieldComponent } from './components/dynamic-form/fields/textarea-field/textarea-field.component';
import { TextEditorFieldComponent } from './components/dynamic-form/fields/text-editor-field/text-editor-field.component';
import { SelectFieldComponent } from './components/dynamic-form/fields/select-field/select-field.component';
import { NumberFieldComponent } from './components/dynamic-form/fields/number-field/number-field.component';
import { DateFieldComponent } from './components/dynamic-form/fields/date-field/date-field.component';
import { CheckboxFieldComponent } from './components/dynamic-form/fields/checkbox-field/checkbox-field.component';
import { RadioFieldComponent } from './components/dynamic-form/fields/radio-field/radio-field.component';
import { UploadFieldComponent } from './components/dynamic-form/fields/upload-field/upload-field.component';
import { MatrixFieldComponent } from './components/dynamic-form/fields/matrix-field/matrix-field.component';
import { ValidationService } from './services/validation.service';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    DynamicFormComponent,
    DemoPageComponent,
    FieldRendererComponent,
    TextFieldComponent,
    PhoneFieldComponent,
    PasswordFieldComponent,
    EmailFieldComponent,
    TextareaFieldComponent,
    TextEditorFieldComponent,
    SelectFieldComponent,
    NumberFieldComponent,
    DateFieldComponent,
    CheckboxFieldComponent,
    RadioFieldComponent,
    UploadFieldComponent,
    MatrixFieldComponent
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
