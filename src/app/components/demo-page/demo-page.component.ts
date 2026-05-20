import { Component, OnInit } from '@angular/core';
import { FormConfig } from '../../models/dynamic-form.model';
import { DEMO_FORM_CONFIG, DEMO_MATRIX_CONFIG, COMPLEX_FORM_CONFIG } from '../../config/form-config';

@Component({
  selector: 'app-demo-page',
  template: `
    <div class="container py-5">
      <div class="demo-header mb-5">
        <h1 class="display-5 fw-bold">Dynamic Form Component</h1>
        <p class="lead text-muted">Angular 動態表單元件 - 依據 JSON 配置自動生成表單</p>
      </div>

      <div class="demo-tabs mb-4">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a class="nav-link" [class.active]="activeTab === 'basic'" (click)="activeTab = 'basic'">
              基本表單
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [class.active]="activeTab === 'matrix'" (click)="activeTab = 'matrix'">
              矩陣表單
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [class.active]="activeTab === 'complex'" (click)="activeTab = 'complex'">
              綜合範例
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [class.active]="activeTab === 'json'" (click)="activeTab = 'json'">
              JSON 配置
            </a>
          </li>
        </ul>
      </div>

      <div class="demo-content">
        <app-dynamic-form
          *ngIf="activeTab !== 'json'"
          [config]="currentConfig"
          [initialData]="initialData"
          (formSubmitted)="onFormSubmitted($event)"
          (formError)="onFormError($event)"
          (fileSelected)="onFileSelected($event)"
        ></app-dynamic-form>

        <div *ngIf="activeTab === 'json'" class="json-viewer">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Form Configuration JSON</h5>
              <button class="btn btn-sm btn-outline-secondary" (click)="copyJson()">
                複製
              </button>
            </div>
            <div class="card-body">
              <pre><code>{{ currentConfigJson }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-footer mt-5">
        <div class="alert alert-info" *ngIf="lastSubmission">
          <h6 class="alert-heading">表單已提交</h6>
          <pre>{{ lastSubmission | json }}</pre>
        </div>
        <div class="alert alert-danger" *ngIf="lastError">
          <h6 class="alert-heading">提交失敗</h6>
          <pre>{{ lastError | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-header {
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 1rem;
    }

    .demo-tabs {
      .nav-pills {
        gap: 0.5rem;

        .nav-link {
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s;

          &.active {
            background-color: #0d6efd;
          }

          &:not(.active) {
            color: #495057;
            background-color: #f8f9fa;

            &:hover {
              background-color: #e9ecef;
            }
          }
        }
      }
    }

    .json-viewer {
      .card {
        border: 1px solid #dee2e6;
        border-radius: 0.5rem;
      }

      .card-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
      }

      pre {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.375rem;
        overflow-x: auto;
        margin: 0;
        max-height: 500px;
        font-size: 0.8125rem;
      }
    }

    .demo-footer {
      pre {
        margin: 0;
        font-size: 0.8125rem;
        max-height: 300px;
        overflow-y: auto;
      }
    }
  `]
})
export class DemoPageComponent implements OnInit {
  activeTab: string = 'basic';
  initialData: Record<string, any> = {};
  lastSubmission: any = null;
  lastError: any = null;

  configs: Record<string, FormConfig> = {
    basic: DEMO_FORM_CONFIG,
    matrix: DEMO_MATRIX_CONFIG,
    complex: COMPLEX_FORM_CONFIG
  };

  constructor() {}

  ngOnInit(): void {}

  get currentConfig(): FormConfig {
    return this.configs[this.activeTab] || DEMO_FORM_CONFIG;
  }

  get currentConfigJson(): string {
    return JSON.stringify(this.currentConfig, null, 2);
  }

  onFormSubmitted(data: any): void {
    this.lastSubmission = data.submission || data;
    this.lastError = null;
  }

  onFormError(errors: any): void {
    this.lastError = errors;
    console.log('Validation Errors:', errors);
  }

  onFileSelected(event: { field: string; files: File[] }): void {
    console.log('File selected:', event);
  }

  copyJson(): void {
    navigator.clipboard.writeText(this.currentConfigJson).then(() => {
      alert('已複製到剪貼簿');
    });
  }
}
