import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {CookieService} from "ngx-cookie-service";
import {SERVICE_URL} from "../constants";

@Injectable()
export class AuthService {
    private authServiceUrl = SERVICE_URL + "/login";
    private accessToken = "c269b69c-6c1b-43df-94b0-bf8c3ce314d6";

    constructor(private http: HttpClient,
                private cookieService: CookieService) {
    }

    public login(username: string, password: string): Observable<any> {
        let formData: FormData = new FormData();
        formData.set("email", username);
        formData.set("password", password);
        // let httpParams = new HttpParams()
        //     .set("email", username)
        //     .set("password", password);
        // let headers = new HttpHeaders();
        // headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(this.authServiceUrl,
            formData,
            // {headers: headers, responseType: 'text'},
            {responseType: 'text'}
            ).pipe(map((response: any) => {
                if (response) {
                    const responseParsed = JSON.parse(response);
                    this.cookieService.set("access_token", responseParsed.access_token);
                    return responseParsed;
                } else {
                    return null;
                }
            }), catchError((err) => {
                return of(null);
            })
        );
    }

    public logout(): void {
        this.cookieService.delete("access_token");
    }
}
