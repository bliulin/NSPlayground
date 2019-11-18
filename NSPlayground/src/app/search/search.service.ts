import { Injectable } from "@angular/core";
import { Grocery } from "../shared/models/grocery";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { throwError, Observable } from "rxjs";

@Injectable()
export class SearchService {

    private baseUrl = "https://3z6gz.mocklab.io/"

    constructor(private http: HttpClient) {}

    public search(query: string): Observable<Grocery[]> {
        const url = this.baseUrl + `search?q=` + query
        return this.http.get(url)
        .pipe(
            map((data: any[]) => {
                return data.map(item => new Grocery(item.id, item.name))
            }),
            catchError(this.handleErrors)
        )
    }

    private handleErrors(error: HttpErrorResponse) {
        console.log(error);
        return throwError(error);
    }
}