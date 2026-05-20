import { Component } from '@angular/core';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'app-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss']
})
export class TextareaFieldComponent extends BaseFieldComponent {}
