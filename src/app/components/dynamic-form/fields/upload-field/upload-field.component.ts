import { Component } from '@angular/core';
import { BaseFieldComponent } from '../base/base-field.component';

@Component({
  selector: 'app-upload-field',
  templateUrl: './upload-field.component.html',
  styleUrls: ['./upload-field.component.scss']
})
export class UploadFieldComponent extends BaseFieldComponent {
  files: File[] = [];
  dragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    if (!this.isReadonly) {
      this.onFilesSelected(event.dataTransfer?.files || null);
    }
  }

  onFilesSelected(fileList: FileList | null): void {
    if (!fileList?.length) return;
    const maxFiles = this.field.uploadConfig?.maxFiles || 1;
    this.files = Array.from(fileList).slice(0, maxFiles);
    this.updateValue(this.files);
    this.fileSelected.emit({ field: this.field.key, files: this.files });
  }

  removeFile(index: number): void {
    this.files = this.files.filter((_, fileIndex) => fileIndex !== index);
    this.updateValue(this.files);
  }
}
