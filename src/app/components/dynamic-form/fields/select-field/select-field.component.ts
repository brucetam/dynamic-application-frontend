import { Component } from '@angular/core';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent extends BaseFieldComponent {
  onSelectionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = this.field.multiple
      ? Array.from(select.selectedOptions).map(option => option.value)
      : select.value;
    this.updateValue(value);
  }
}
