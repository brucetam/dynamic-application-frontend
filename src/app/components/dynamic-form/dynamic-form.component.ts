import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FieldConfig, FormConfig, ValidationRule, FieldType, MatrixColumn, MatrixRow } from '../../models/dynamic-form.model';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormComponent),
      multi: true
    }
  ]
})
export class DynamicFormComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() config: FormConfig;
  @Input() initialData: Record<string, any> = {};
  @Input() readonly: boolean = false;
  @Input() submitOnInit: boolean = false;

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() formChanged = new EventEmitter<any>();
  @Output() formError = new EventEmitter<any>();
  @Output() fileSelected = new EventEmitter<{ field: string; files: File[] }>();

  form: FormGroup;
  errors: Record<string, string> = {};
  fieldErrors: Record<string, Record<string, string>> = {};
  isSubmitting: boolean = false;
  submitted: boolean = false;

  uploadedFiles: Record<string, File[]> = {};
  filePreviews: Record<string, string[]> = {};
  matrixData: Record<string, any[]> = {};

  draggingRowIndex: number = -1;
  dragOverRowIndex: number = -1;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.submitOnInit && this.config?.apiEndpoint) {
      this.submit();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.config) {
      this.buildForm();
    }
    if (changes['initialData'] && this.initialData) {
      this.patchData(this.initialData);
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.patchData(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form?.disable();
    } else {
      this.form?.enable();
    }
  }

  getFieldClass(config: FieldConfig): string {
    let classes = 'form-group';
    if (config.cssClass) {
      classes += ` ${config.cssClass}`;
    }
    if (config.type === 'matrix') {
      classes += ' matrix-field';
    }
    if (this.errors[config.key]) {
      classes += ' has-error';
    }
    return classes;
  }

  getColumnClass(width: number): string {
    return `col-${Math.min(width || 12, 12)}`;
  }

  buildForm(): void {
    if (!this.config?.fields) return;

    const controls: Record<string, FormControl> = {};

    this.config.fields.forEach(field => {
      if (field.type === 'matrix') {
        this.matrixData[field.key] = this.getInitialMatrixData(field);
        controls[field.key] = new FormControl(this.matrixData[field.key]);
      } else {
        controls[field.key] = new FormControl(field.defaultValue || '');
      }
    });

    this.form = this.fb.group(controls);
    this.form.valueChanges.subscribe(value => {
      this.onChange(value);
      this.formChanged.emit(value);
      this.validateAllFields();
    });
  }

  private getInitialMatrixData(field: FieldConfig): any[] {
    const initial = this.initialData[field.key];
    if (Array.isArray(initial)) return initial;
    
    const rows = field.matrixConfig?.[0];
    if (rows?.repeatable && rows.minRows) {
      return Array(rows.minRows).fill({}).map(() => this.createMatrixRow(rows));
    }
    return [this.createMatrixRow(rows)];
  }

  private createMatrixRow(matrixRow: MatrixRow): any {
    const row: any = {};
    matrixRow.columns.forEach(col => {
      row[col.key] = '';
    });
    return row;
  }

  patchData(data: Record<string, any>): void {
    if (!this.form) return;

    this.config.fields.forEach(field => {
      if (field.type === 'matrix') {
        this.matrixData[field.key] = data[field.key] || this.getInitialMatrixData(field);
      } else if (field.type === 'upload') {
        if (data[field.key]) {
          this.filePreviews[field.key] = Array.isArray(data[field.key]) 
            ? data[field.key] 
            : [data[field.key]];
        }
      }
    });

    this.form.patchValue(data, { emitEvent: true });
  }

  validateAllFields(): void {
    this.errors = {};
    this.fieldErrors = {};

    this.config.fields.forEach(field => {
      this.validateField(field);
    });
  }

  validateField(field: FieldConfig): boolean {
    const control = this.form.get(field.key);
    if (!control) return true;

    let error: string | null = null;

    if (field.validation) {
      error = this.validationService.validateField(control.value, field.validation);
    }

    if (!error && field.type) {
      error = this.validationService.validateByFieldType(control.value, field.type);
    }

    if (error) {
      this.errors[field.key] = error;
      this.fieldErrors[field.key] = { [field.key]: error };
    } else {
      delete this.errors[field.key];
      delete this.fieldErrors[field.key];
    }

    return !error;
  }

  isFieldInvalid(field: string): boolean {
    return !!this.errors[field];
  }

  getErrorMessage(field: string): string {
    return this.errors[field] || '';
  }

  hasRequiredValidator(field: FieldConfig): boolean {
    return field.validation?.some(v => v.type === 'required') || false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent, field: FieldConfig): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files || null;
    this.onFileSelected(field, files);
  }

  execCommand(command: string): void {
    document.execCommand(command, false);
  }

  onFieldChange(field: FieldConfig, value: any): void {
    const control = this.form.get(field.key);
    if (control) {
      control.setValue(value);
    }
    this.validateField(field);
  }

  onFileSelected(field: FieldConfig, files: FileList | null): void {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validationErrors: string[] = [];

    for (const file of fileArray) {
      const error = this.validationService.validateFile(file, {
        accept: field.uploadConfig?.accept,
        maxSize: field.uploadConfig?.maxSize
      });
      if (error) {
        validationErrors.push(error);
      }
    }

    if (validationErrors.length > 0) {
      this.errors[field.key] = validationErrors[0];
      this.fieldErrors[field.key] = { [field.key]: validationErrors[0] };
      return;
    }

    this.uploadedFiles[field.key] = fileArray;
    this.updateFilePreviews(field, fileArray);
    this.onFieldChange(field, this.uploadedFiles[field.key]);
    this.fileSelected.emit({ field: field.key, files: fileArray });
  }

  removeFile(field: string, index: number): void {
    const files = this.uploadedFiles[field];
    if (files) {
      files.splice(index, 1);
      const newFiles = [...files];
      this.uploadedFiles[field] = newFiles;
      this.updateFilePreviewsByKey(field, newFiles);
      this.onFieldChange({ key: field, type: 'upload' } as FieldConfig, newFiles);
    }
  }

  private updateFilePreviews(field: FieldConfig, files: File[]): void {
    const previews: string[] = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        previews.push(url);
      } else {
        previews.push(file.name);
      }
    });
    this.filePreviews[field.key] = previews;
  }

  private updateFilePreviewsByKey(fieldKey: string, files: File[]): void {
    const field = this.config.fields.find(f => f.key === fieldKey);
    if (field) {
      this.updateFilePreviews(field, files);
    }
  }

  addMatrixRow(field: FieldConfig): void {
    const matrixConfig = field.matrixConfig?.[0];
    if (!matrixConfig?.repeatable) return;

    const currentRows = this.matrixData[field.key] || [];
    const maxRows = matrixConfig.maxRows || 10;

    if (currentRows.length >= maxRows) {
      return;
    }

    const newRow = this.createMatrixRow(matrixConfig);
    this.matrixData[field.key] = [...currentRows, newRow];
    this.onFieldChange(field, this.matrixData[field.key]);
  }

  removeMatrixRow(field: FieldConfig, index: number): void {
    const currentRows = this.matrixData[field.key] || [];
    if (currentRows.length <= 1) return;

    const matrixConfig = field.matrixConfig?.[0];
    if (matrixConfig?.minRows && currentRows.length <= matrixConfig.minRows) {
      return;
    }

    const newRows = currentRows.filter((_: any, i: number) => i !== index);
    this.matrixData[field.key] = newRows;
    this.onFieldChange(field, this.matrixData[field.key]);
  }

  moveMatrixRow(field: FieldConfig, index: number, direction: number): void {
    const currentRows = this.matrixData[field.key] || [];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= currentRows.length) {
      return;
    }

    const newRows = [...currentRows];
    const temp = newRows[index];
    newRows[index] = newRows[newIndex];
    newRows[newIndex] = temp;

    this.matrixData[field.key] = newRows;
    this.onFieldChange(field, this.matrixData[field.key]);
  }

  onMatrixDragStart(event: DragEvent, rowIndex: number): void {
    this.draggingRowIndex = rowIndex;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(rowIndex));
    }
  }

  onMatrixDragOver(event: DragEvent, rowIndex: number): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverRowIndex = rowIndex;
  }

  onMatrixDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverRowIndex = -1;
  }

  onMatrixDrop(event: DragEvent, field: FieldConfig, targetIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    const sourceIndex = this.draggingRowIndex;
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      this.clearDragState();
      return;
    }

    const currentRows = this.matrixData[field.key] || [];
    const newRows = [...currentRows];
    const [movedRow] = newRows.splice(sourceIndex, 1);
    newRows.splice(targetIndex, 0, movedRow);

    this.matrixData[field.key] = newRows;
    this.onFieldChange(field, this.matrixData[field.key]);
    this.clearDragState();
  }

  onMatrixDragEnd(event: DragEvent): void {
    this.clearDragState();
  }

  private clearDragState(): void {
    this.draggingRowIndex = -1;
    this.dragOverRowIndex = -1;
  }

  onMatrixCellChange(field: FieldConfig, rowIndex: number, column: MatrixColumn, value: any): void {
    const rows = this.matrixData[field.key] || [];
    if (rows[rowIndex]) {
      rows[rowIndex][column.key] = value;
      this.matrixData[field.key] = [...rows];
      this.onFieldChange(field, this.matrixData[field.key]);
    }
  }

  submit(): void {
    this.validateAllFields();

    if (this.form.invalid || Object.keys(this.errors).length > 0) {
      this.formError.emit(this.errors);
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareSubmission();

    if (this.config.apiEndpoint) {
      // Will be handled by parent component via API service
      this.formSubmitted.emit(formData);
    } else {
      this.formSubmitted.emit(formData);
      this.isSubmitting = false;
    }
  }

  cancel(): void {
    this.form.reset();
    this.errors = {};
    this.fieldErrors = {};
  }

  private prepareSubmission(): any {
    const values = this.form.value;
    const files: File[] = [];

    this.config.fields.forEach(field => {
      if (field.type === 'upload' && this.uploadedFiles[field.key]) {
        files.push(...this.uploadedFiles[field.key]);
      }
    });

    return {
      formId: this.config.id,
      data: values,
      files
    };
  }

  onSubmitSuccess(): void {
    this.isSubmitting = false;
    this.submitted = true;
  }

  onSubmitError(error: any): void {
    this.isSubmitting = false;
    if (error.errors) {
      this.errors = { ...this.errors, ...error.errors };
    }
    this.formError.emit(error);
  }

  getStars(row: number): number[] {
    return Array(row).fill(0);
  }

  trackByIndex(index: number): number {
    return index;
  }
}