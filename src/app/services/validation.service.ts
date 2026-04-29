import { Injectable } from '@angular/core';
import { ValidationRule, FieldConfig } from '../models/dynamic-form.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private validationPatterns: Record<string, RegExp> = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?[\d\s\-()]+$/,
    url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    alpha: /^[a-zA-Z]+$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    decimal: /^\d+(\.\d+)?$/,
  };

  validateField(value: any, rules: ValidationRule[]): string | null {
    if (!rules || rules.length === 0) return null;

    for (const rule of rules) {
      const error = this.validateRule(value, rule);
      if (error) return error;
    }
    return null;
  }

  private validateRule(value: any, rule: ValidationRule): string | null {
    const val = value ?? '';
    const strVal = String(val).trim();

    switch (rule.type) {
      case 'required':
        if (val === null || val === undefined || strVal === '') {
          return rule.message || '此欄位為必填';
        }
        break;

      case 'minLength':
        if (strVal.length < (rule.value as number)) {
          return rule.message || `最少需要 ${rule.value} 個字元`;
        }
        break;

      case 'maxLength':
        if (strVal.length > (rule.value as number)) {
          return rule.message || `最多允許 ${rule.value} 個字元`;
        }
        break;

      case 'min':
        if (Number(val) < (rule.value as number)) {
          return rule.message || `最小值為 ${rule.value}`;
        }
        break;

      case 'max':
        if (Number(val) > (rule.value as number)) {
          return rule.message || `最大值為 ${rule.value}`;
        }
        break;

      case 'pattern':
        const pattern = rule.value instanceof RegExp 
          ? rule.value 
          : new RegExp(rule.value as string);
        if (!pattern.test(strVal)) {
          return rule.message || '格式不符合要求';
        }
        break;

      case 'custom':
        if (rule.value instanceof Function) {
          const result = (rule.value as Function)(val);
          if (!result) {
            return rule.message || '驗證失敗';
          }
        }
        break;
    }

    return null;
  }

  validateByFieldType(value: any, type: string): string | null {
    const strVal = String(value ?? '').trim();

    switch (type) {
      case 'email':
        if (strVal && !this.validationPatterns['email'].test(strVal)) {
          return '請輸入有效的電子郵件地址';
        }
        break;

      case 'number':
      case 'numeric':
        if (strVal && isNaN(Number(strVal))) {
          return '請輸入有效的數字';
        }
        break;

      case 'url':
        if (strVal && !this.validationPatterns['url'].test(strVal)) {
          return '請輸入有效的 URL';
        }
        break;
    }

    return null;
  }

  validateFile(file: File, config: { accept?: string; maxSize?: number }): string | null {
    if (!file) return null;

    if (config.accept) {
      const acceptedTypes = config.accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const ext = file.name.split('.').pop()?.toLowerCase();
      
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) return type.slice(1) === ext;
        if (type.startsWith('*')) return type.replace('*', '') === fileType.split('/')[0];
        return type === fileType;
      });

      if (!isValidType) {
        return `不支援的檔案類型，請上傳 ${config.accept} 格式`;
      }
    }

    if (config.maxSize && file.size > config.maxSize) {
      const maxMB = (config.maxSize / 1024 / 1024).toFixed(2);
      return `檔案大小不能超過 ${maxMB} MB`;
    }

    return null;
  }
}