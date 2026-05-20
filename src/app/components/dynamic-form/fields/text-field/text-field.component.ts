import { Component } from '@angular/core';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent extends BaseFieldComponent {}
