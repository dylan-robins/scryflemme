import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

interface HelloResponse {
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly hello$ = this.http.get<HelloResponse>('/api/hello').pipe(
    catchError((error) => {
      console.error('Failed to load hello message from the API', error);
      return of<HelloResponse>({
        message: 'Unable to load the backend greeting.'
      });
    })
  );
}
