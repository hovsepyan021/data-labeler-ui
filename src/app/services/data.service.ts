import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {CookieService} from "ngx-cookie-service";
import {CountryModel} from "../models/country-model";
import {HolidayModel} from "../models/holiday-model";
import {Message} from "../models/message-model";
import {Term} from "../models/term-model";
import {Label} from "../models/label-model";
import {SERVICE_URL} from "../constants";

@Injectable()
export class DataService {
    private holidaysServiceUrl = SERVICE_URL;
    private loadCountriesUrlPath = "/countries?pretty&key=access_token";
    private loadHolidaysByCountryUrlPath =
        "/holidays?pretty&key=access_token&country=country_code&year=year_number&language=language_code";
    private loadMessagesURLPath =
        "/messages";
    private sendMessageURLPath =
        "/message/label";
    private loadTermsURLPath =
        "/terms";
    private loadLabelsURLPath =
        "/labels";

    constructor(private http: HttpClient,
                private cookieService: CookieService) {
    }

    public loadMessages(): Observable<Message[]> {
        const accessToken = this.cookieService.get("access_token");
        const url = this.holidaysServiceUrl +
            this.loadMessagesURLPath;

        let headers = new HttpHeaders({
            access_token: accessToken
        });

        return this.http.get(url, {headers: headers}).pipe(map((response: any) => {
            if (response) {
                return response;
            } else {
                return [];
            }
        }));
    }

    public loadTerms(): Observable<Term[]> {
        const accessToken = this.cookieService.get("access_token");
        const url = this.holidaysServiceUrl +
            this.loadTermsURLPath;

        let headers = new HttpHeaders({
            access_token: accessToken
        });

        return this.http.get(url, {headers: headers}).pipe(map((response: any) => {
            if (response) {
                return response;
            } else {
                return [];
            }
        }));
    }

    public loadLabels(): Observable<Label[]> {
        const accessToken = this.cookieService.get("access_token");
        const url = this.holidaysServiceUrl +
            this.loadLabelsURLPath;

        let headers = new HttpHeaders({
            access_token: accessToken
        });

        return this.http.get(url, {headers: headers}).pipe(map((response: any) => {
            if (response) {
                return response;
            } else {
                return [];
            }
        }));
    }


    public sendItem(currentItem: Message): Observable<any> {
        const accessToken = this.cookieService.get("access_token");
        const url = this.holidaysServiceUrl +
            this.sendMessageURLPath;

        let headers = new HttpHeaders({
            access_token: accessToken
        });

        return this.http.post(url, currentItem, {headers: headers}).pipe(map((response: any) => {
            if (response) {
                return response;
            } else {
                return [];
            }
        }));
    }

    // public loadAllCountries(): Observable<CountryModel[]> {
    //     let accessToken = this.cookieService.get("access_token");
    //     let url = this.holidaysServiceUrl +
    //         this.loadCountriesUrlPath.replace("access_token", accessToken);
    //
    //     return this.http.get(url).pipe(map((response: any) => {
    //             if (response) {
    //                 return response.countries;
    //             } else {
    //                 return [];
    //             }
    //         }));
    // }

    // public loadHolidaysByCountry(countryCode: string, year: string, languageCode: string): Observable<HolidayModel[]> {
    //     let accessToken = this.cookieService.get("access_token");
    //     let url = this.holidaysServiceUrl +
    //         this.loadHolidaysByCountryUrlPath.replace("access_token", accessToken)
    //             .replace("country_code", countryCode)
    //             .replace("year_number", year)
    //             .replace("language_code", languageCode);
    //
    //     return this.http.get(url).pipe(map((response: any) => {
    //         if (response) {
    //             return response.holidays;
    //         } else {
    //             return [];
    //         }
    //     }));
    // }
}
