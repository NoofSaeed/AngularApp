import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
providedIn: 'root'
})
export class RestfulService
{
  url: string;
  errorMsg: string;

  constructor(private http: HttpClient) {
  }
    getAll() : Observable<any[]> {
      return this.http.get<any[]>(this.url);
    }


    getAllNo() : Observable<any[]> {
    return this.http.get<any[]>(this.url);
    }

    getById(id: string) : Observable<any> {
    return this.http.get<any>(this.url + '/' + id);
    }

    private handleError(err:any)
    {
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${ err.error.message}`;
        } else
        {
            errorMessage = `Backend returned code ${ err.status}: ${ err.body.error}`;
        }
        console.error(err);
      return throwError(errorMessage);
    }



    create(entity) : Observable<any> {

    let HTTPOptions: Object = {
      responseType: 'text' as 'json'
    }
    return this.http.post<any>(this.url,
    entity, HTTPOptions).pipe(
    catchError(this.handleError)
  );  
}

  update(id: any, entity): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

return this.http.put<any>(this.url + '/' + id,
  entity, httpOptions);
  }

  delete(id: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
return this.http.delete<any>(this.url + '/' + id,
  httpOptions);
  }
}
