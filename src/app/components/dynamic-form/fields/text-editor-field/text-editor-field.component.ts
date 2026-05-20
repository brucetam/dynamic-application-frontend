import { Component } from '@angular/core';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'app-text-editor-field',
  templateUrl: './text-editor-field.component.html',
  styleUrls: ['./text-editor-field.component.scss']
})
export class TextEditorFieldComponent extends BaseFieldComponent {
  exec(command: string): void {
    document.execCommand(command, false);
  }
}
