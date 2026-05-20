import { Component } from '@angular/core';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss']
})
export class PhoneFieldComponent extends BaseFieldComponent {
  defaultCodes = [
    { label: '+852', value: '+852' },
    { label: '+853', value: '+853' },
    { label: '+86', value: '+86' },
    { label: '+886', value: '+886' },
    { label: '+1', value: '+1' }
  ];

  get countryCodes() {
    return this.field.phoneConfig?.countryCodes?.length ? this.field.phoneConfig.countryCodes : this.defaultCodes;
  }

  get value() {
    return this.control?.value || {};
  }

  get countryCode(): string {
    return this.value.countryCode || this.field.phoneConfig?.defaultCountryCode || this.countryCodes[0].value;
  }

  get phoneNumber(): string {
    return this.value.number || '';
  }

  setCountryCode(countryCode: string): void {
    this.updateValue({ ...this.value, countryCode });
  }

  setPhoneNumber(number: string): void {
    this.control?.setValue({ ...this.value, countryCode: this.countryCode, number });
  }

  emitValue(): void {
    this.updateValue({ ...this.value, countryCode: this.countryCode });
  }
}
