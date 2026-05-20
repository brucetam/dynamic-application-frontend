import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldConfig, FormConfig, FormSubmission } from '../../models/dynamic-form.model';
import { ApiService } from '../../services/api.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() config!: FormConfig;
  @Input() initialData: Record<string, any> = {};
  @Input() readonly = false;

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() formChanged = new EventEmitter<any>();
  @Output() formError = new EventEmitter<any>();
  @Output() fileSelected = new EventEmitter<{ field: string; files: File[] }>();

  form!: FormGroup;
  errors: Record<string, string> = {};
  isSubmitting = false;
  previewOpen = false;
  uploadedFiles: Record<string, File[]> = {};

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['config'] || changes['initialData']) && this.config?.fields) {
      this.buildForm();
    }
  }

  get fields(): FieldConfig[] {
    return this.config?.fields || [];
  }

  fieldStyle(field: FieldConfig): Record<string, string> {
    const width = Math.min(field.width || 12, 12);
    return {
      flex: `1 1 ${Math.max(260, Math.round((width / 12) * 1000))}px`,
      maxWidth: '100%'
    };
  }

  buildForm(): void {
    if (!this.config?.fields) return;

    const controls: Record<string, any> = {};
    this.config.fields.forEach(field => {
      controls[field.key] = [this.initialData[field.key] ?? this.defaultValue(field)];
    });

    this.form = this.fb.group(controls);
    this.form.valueChanges.subscribe(value => this.formChanged.emit(value));
  }

  onFieldChanged(): void {
    this.validateAllFields();
  }

  onFileSelected(event: { field: string; files: File[] }): void {
    this.uploadedFiles[event.field] = event.files;
    this.fileSelected.emit(event);
    this.validateAllFields();
  }

  openPreview(): void {
    this.validateAllFields();
    if (Object.keys(this.errors).length) {
      this.formError.emit(this.errors);
      return;
    }
    this.previewOpen = true;
  }

  closePreview(): void {
    this.previewOpen = false;
  }

  submit(): void {
    this.validateAllFields();
    if (Object.keys(this.errors).length) {
      this.formError.emit(this.errors);
      return;
    }

    const submission = this.prepareSubmission();
    this.isSubmitting = true;

    if (!this.config.apiEndpoint) {
      this.formSubmitted.emit(submission);
      this.isSubmitting = false;
      this.previewOpen = false;
      return;
    }

    this.apiService.submitForm({
      formId: this.config.apiEndpoint,
      data: submission.data,
      files: submission.files
    }).subscribe({
      next: response => {
        this.formSubmitted.emit({ submission, response });
        this.isSubmitting = false;
        this.previewOpen = false;
      },
      error: error => {
        this.isSubmitting = false;
        if (error.errors) {
          this.errors = { ...this.errors, ...error.errors };
        }
        this.formError.emit(error);
      }
    });
  }

  cancel(): void {
    this.form.reset();
    this.errors = {};
    this.previewOpen = false;
  }

  getPreviewRows(): Array<{ label: string; value: any }> {
    return this.fields.map(field => ({
      label: field.label,
      value: this.formatPreviewValue(this.form?.value?.[field.key])
    }));
  }

  private validateAllFields(): void {
    this.errors = {};
    this.fields.forEach(field => this.validateField(field, this.form?.value?.[field.key], field.key));
  }

  private validateField(field: FieldConfig, value: any, path: string): void {
    const ruleError = field.validation?.length ? this.validationService.validateField(value, field.validation) : null;
    const typeError = !ruleError ? this.validationService.validateByFieldType(value, field.type) : null;
    const fileError = !ruleError && !typeError && field.type === 'upload' ? this.validateUploadField(field, value) : null;
    const error = ruleError || typeError || fileError;

    if (error) {
      this.errors[path] = error;
      return;
    }

    if (field.type === 'matrix') {
      const childFields = this.getMatrixChildFields(field);
      (Array.isArray(value) ? value : []).forEach((row, index) => {
        childFields.forEach(childField => this.validateField(childField, row?.[childField.key], `${path}.${index}.${childField.key}`));
      });
    }
  }

  private validateUploadField(field: FieldConfig, value: any): string | null {
    const files = Array.isArray(value) ? value : [];
    for (const file of files) {
      const error = this.validationService.validateFile(file, {
        accept: field.uploadConfig?.accept,
        maxSize: field.uploadConfig?.maxSize
      });
      if (error) return error;
    }
    return null;
  }

  private prepareSubmission(): FormSubmission {
    return {
      formId: this.config.id,
      data: this.form.value,
      files: this.collectFiles(this.fields, this.form.value)
    };
  }

  private collectFiles(fields: FieldConfig[], values: Record<string, any>): File[] {
    const files: File[] = [];
    fields.forEach(field => {
      const value = values?.[field.key];
      if (field.type === 'upload' && Array.isArray(value)) {
        files.push(...value.filter(item => item instanceof File));
      }
      if (field.type === 'matrix') {
        const childFields = this.getMatrixChildFields(field);
        (Array.isArray(value) ? value : []).forEach(row => files.push(...this.collectFiles(childFields, row)));
      }
    });
    return files;
  }

  private defaultValue(field: FieldConfig): any {
    if (field.defaultValue !== undefined) return field.defaultValue;
    if (field.type === 'select' && field.multiple) return [];
    if (field.type === 'phone') return { countryCode: field.phoneConfig?.defaultCountryCode || '+852', number: '' };
    if (field.type === 'upload') return [];
    if (field.type === 'matrix') return this.defaultMatrixRows(field);
    if (field.type === 'checkbox') return false;
    return '';
  }

  private defaultMatrixRows(field: FieldConfig): any[] {
    const config = field.matrixConfig?.[0];
    const minRows = config?.minRows || 1;
    const childFields = this.getMatrixChildFields(field);
    return Array.from({ length: minRows }, () => {
      const row: Record<string, any> = {};
      childFields.forEach(childField => row[childField.key] = this.defaultValue(childField));
      return row;
    });
  }

  private getMatrixChildFields(field: FieldConfig): FieldConfig[] {
    const config = field.matrixConfig?.[0];
    return (config?.fields?.length ? config.fields : config?.columns || []) as FieldConfig[];
  }

  private formatPreviewValue(value: any): any {
    if (Array.isArray(value)) {
      if (value.every(item => item instanceof File)) {
        return value.map(file => file.name).join(', ');
      }
      return JSON.stringify(value, null, 2);
    }
    if (value && typeof value === 'object') {
      if ('countryCode' in value || 'number' in value) {
        return `${value.countryCode || ''} ${value.number || ''}`.trim();
      }
      return JSON.stringify(value, null, 2);
    }
    return value || '-';
  }
}
