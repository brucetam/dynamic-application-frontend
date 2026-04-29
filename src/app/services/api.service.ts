import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpEvent } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FormSubmission } from '../models/dynamic-form.model';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';
  private progressSubject = new Subject<UploadProgress>();

  progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {}

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  submitForm(submission: FormSubmission): Observable<ApiResponse> {
    const formData = this.prepareFormData(submission);
    return this.http.post<ApiResponse>(`${this.baseUrl}${submission.formId}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => this.handleProgress(event)),
      map(event => this.extractData(event)),
      catchError(this.handleError.bind(this))
    );
  }

  updateForm(submission: FormSubmission, id: string | number): Observable<ApiResponse> {
    const formData = this.prepareFormData(submission);
    return this.http.put<ApiResponse>(`${this.baseUrl}${submission.formId}/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => this.handleProgress(event)),
      map(event => this.extractData(event)),
      catchError(this.handleError.bind(this))
    );
  }

  patchForm(submission: FormSubmission, id: string | number): Observable<ApiResponse> {
    const formData = this.prepareFormData(submission);
    return this.http.patch<ApiResponse>(`${this.baseUrl}${submission.formId}/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => this.handleProgress(event)),
      map(event => this.extractData(event)),
      catchError(this.handleError.bind(this))
    );
  }

  getFormData<T>(formId: string, id: string | number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${formId}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteFormData(formId: string, id: string | number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}${formId}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  uploadFile(file: File, endpoint?: string, fieldName: string = 'file'): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);

    return this.http.post<ApiResponse<string>>(endpoint || `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => this.handleProgress(event)),
      map(event => this.extractData(event)),
      catchError(this.handleError.bind(this))
    );
  }

  uploadFiles(files: File[], endpoint?: string, fieldName: string = 'files'): Observable<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file, file.name);
    });

    return this.http.post<ApiResponse<string[]>>(endpoint || `${this.baseUrl}/upload/multiple`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => this.handleProgress(event)),
      map(event => this.extractData(event)),
      catchError(this.handleError.bind(this))
    );
  }

  private prepareFormData(submission: FormSubmission): FormData {
    const formData = new FormData();
    formData.append('data', JSON.stringify(submission.data));

    if (submission.files && submission.files.length > 0) {
      submission.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file, file.name);
      });
    }

    return formData;
  }

  private handleProgress(event: HttpEvent<any>): void {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      const progress: UploadProgress = {
        percent: Math.round((100 * event.loaded) / event.total),
        loaded: event.loaded,
        total: event.total
      };
      this.progressSubject.next(progress);
    }
  }

  private extractData(event: HttpEvent<any>): ApiResponse {
    if (event.type === HttpEventType.Response) {
      return event.body;
    }
    return { success: true };
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = '發生未知錯誤';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = '無法連接伺服器，請檢查網路連接';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || '請求資料格式錯誤';
    } else if (error.status === 401) {
      errorMessage = '請重新登入';
    } else if (error.status === 403) {
      errorMessage = '沒有權限執行此操作';
    } else if (error.status === 404) {
      errorMessage = '找不到資源';
    } else if (error.status === 500) {
      errorMessage = '伺服器發生錯誤';
    }

    return throwError(() => ({ success: false, message: errorMessage, errors: error.error?.errors }));
  }
}