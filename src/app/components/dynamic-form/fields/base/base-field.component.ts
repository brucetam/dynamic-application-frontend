import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig, ValidationRule } from '../../../../models/dynamic-form.model';

@Directive()
export abstract class BaseFieldComponent {
  @Input() field!: FieldConfig;
  @Input() form!: FormGroup;
  @Input() readonly = false;
  @Input() errors: Record<string, string> = {};

  @Output() fieldChanged = new EventEmitter<{ field: FieldConfig; value: any }>();
  @Output() fileSelected = new EventEmitter<{ field: string; files: File[] }>();

  get control() {
    return this.form?.get(this.field.key);
  }

  get isRequired(): boolean {
    return this.field.validation?.some((rule: ValidationRule) => rule.type === 'required') || false;
  }

  get errorMessage(): string {
    return this.errors?.[this.field.key] || '';
  }

  get isReadonly(): boolean {
    return this.readonly || !!this.field.readonly;
  }

  updateValue(value: any): void {
    this.control?.setValue(value);
    this.control?.markAsDirty();
    this.fieldChanged.emit({ field: this.field, value });
  }
}
