import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Question {
  question_id: number;
  question: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  correct_answer: string;
  available_time_limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api/question';

  constructor(private http: HttpClient) {}

  getQuestion(): Observable<Question> {
    return this.http.get<Question>(this.apiUrl);
  }
}
