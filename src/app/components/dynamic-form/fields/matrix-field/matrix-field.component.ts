import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFieldComponent } from '../base/base-field.component';
import { FieldConfig, MatrixRow } from '../../../../models/dynamic-form.model';

@Component({
  selector: 'app-matrix-field',
  templateUrl: './matrix-field.component.html',
  styleUrls: ['./matrix-field.component.scss']
})
export class MatrixFieldComponent extends BaseFieldComponent implements OnChanges {
  @Output() override fileSelected = new EventEmitter<{ field: string; files: File[] }>();

  rowForms: FormGroup[] = [];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['form']) {
      this.rebuildRows();
    }
  }

  get matrixConfig(): MatrixRow | undefined {
    return this.field.matrixConfig?.[0];
  }

  get childFields(): FieldConfig[] {
    const config = this.matrixConfig;
    return (config?.fields?.length ? config.fields : config?.columns || []) as FieldConfig[];
  }

  get canAddRow(): boolean {
    const config = this.matrixConfig;
    return !!config?.repeatable && !this.isReadonly && this.rowForms.length < (config.maxRows || 999);
  }

  get canRemoveRow(): boolean {
    const config = this.matrixConfig;
    return !!config?.repeatable && !this.isReadonly && this.rowForms.length > (config.minRows || 0);
  }

  fieldStyle(field: FieldConfig): Record<string, string> {
    const width = Math.min(field.width || 12, 12);
    return {
      flex: `1 1 ${Math.max(240, Math.round((width / 12) * 1000))}px`,
      maxWidth: '100%'
    };
  }

  addRow(): void {
    this.rowForms.push(this.createRowForm(this.createEmptyRow()));
    this.syncRows();
  }

  removeRow(index: number): void {
    this.rowForms = this.rowForms.filter((_, rowIndex) => rowIndex !== index);
    this.syncRows();
  }

  syncRows(): void {
    this.updateValue(this.rowForms.map(rowForm => rowForm.value));
  }

  private rebuildRows(): void {
    if (!this.field || !this.form) return;

    const value = this.control?.value;
    const minRows = this.matrixConfig?.minRows || 1;
    const rows = Array.isArray(value) && value.length ? value : Array.from({ length: minRows }, () => this.createEmptyRow());
    this.rowForms = rows.map(row => this.createRowForm(row));
    this.syncRows();
  }

  private createRowForm(row: Record<string, any>): FormGroup {
    const controls: Record<string, any> = {};
    this.childFields.forEach(childField => {
      controls[childField.key] = [row[childField.key] ?? this.defaultValue(childField)];
    });
    const group = this.fb.group(controls);
    group.valueChanges.subscribe(() => this.syncRows());
    return group;
  }

  private createEmptyRow(): Record<string, any> {
    const row: Record<string, any> = {};
    this.childFields.forEach(childField => {
      row[childField.key] = this.defaultValue(childField);
    });
    return row;
  }

  private defaultValue(field: FieldConfig): any {
    if (field.defaultValue !== undefined) return field.defaultValue;
    if (field.type === 'select' && field.multiple) return [];
    if (field.type === 'phone') return { countryCode: field.phoneConfig?.defaultCountryCode || '+852', number: '' };
    if (field.type === 'upload') return [];
    if (field.type === 'matrix') return [];
    if (field.type === 'checkbox') return false;
    return '';
  }
}
