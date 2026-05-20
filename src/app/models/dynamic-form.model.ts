export type FieldType = 
  | 'text' 
  | 'phone'
  | 'password'
  | 'email' 
  | 'textarea' 
  | 'texteditor' 
  | 'upload' 
  | 'matrix'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'number';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'custom';
  value?: string | number | RegExp;
  message: string;
}

export interface UploadConfig {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  uploadUrl?: string;
}

export interface PhoneConfig {
  defaultCountryCode?: string;
  countryCodes?: SelectOption[];
}

export interface MatrixColumn extends Partial<FieldConfig> {
  key: string;
  label: string;
  type: FieldType;
  width?: number;
  options?: SelectOption[];
  validation?: ValidationRule[];
}

export interface MatrixRow {
  key: string;
  label: string;
  columns: MatrixColumn[];
  fields?: FieldConfig[];
  repeatable?: boolean;
  minRows?: number;
  maxRows?: number;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  width?: number;
  defaultValue?: any;
  options?: SelectOption[];
  multiple?: boolean;
  validation?: ValidationRule[];
  phoneConfig?: PhoneConfig;
  uploadConfig?: UploadConfig;
  matrixConfig?: MatrixRow[];
  disabled?: boolean;
  readonly?: boolean;
  cssClass?: string;
  nestedFields?: FieldConfig[];
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  submitLabel?: string;
  cancelLabel?: string;
  apiEndpoint?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  showCancel?: boolean;
  cssClass?: string;
}

export interface FormSubmission {
  formId: string;
  data: Record<string, any>;
  files?: File[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
