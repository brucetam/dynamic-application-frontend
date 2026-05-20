import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/dynamic-form.model';

@Component({
  selector: 'app-field-renderer',
  templateUrl: './field-renderer.component.html',
  styleUrls: ['./field-renderer.component.scss']
})
export class FieldRendererComponent {
  @Input() field!: FieldConfig;
  @Input() form!: FormGroup;
  @Input() readonly = false;
  @Input() errors: Record<string, string> = {};

  @Output() fieldChanged = new EventEmitter<{ field: FieldConfig; value: any }>();
  @Output() fileSelected = new EventEmitter<{ field: string; files: File[] }>();
}
