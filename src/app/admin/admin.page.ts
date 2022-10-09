import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../services/data.service";
import {CountryModel} from "../models/country-model";
import {YearModel} from "../models/year-model";
import {HolidayModel} from "../models/holiday-model";
import {Message} from "../models/message-model";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {catchError, map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import * as FileSaver from 'file-saver';
import {SERVICE_URL} from "../constants";

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.page.html',
    styleUrls: ['admin.page.scss'],
})
export class AdminPage implements OnInit {
    public countries: CountryModel[];
    public selectedCountry: string;
    public years: YearModel[];
    public selectedYear: string;
    public isLoading = false;
    public loadedMessages: Message[];
    public labeledCount = 0;
    public skippedCount = 0;
    public currentCount = 0;
    public started = false;
    public currentItem: Message = null;
    public highlightedCharacters: any[];

    public showImportSuccess: boolean;
    public showImportFailed: boolean;

    public loadedHolidays: HolidayModel[] = [];

    constructor(private cookieService: CookieService, private http: HttpClient, private dataService: DataService, private router: Router, private authService: AuthService) {
    }

    private importUrl = SERVICE_URL + "/import";
    private exportUrl = SERVICE_URL + "/export";

    ngOnInit(): void {
        // this.loadCountries();
        // this.initYears();
    }
    end() {
        this.started = false;
        this.currentItem = null;
        this.loadedMessages = null;
        this.highlightedCharacters = null;
        this.currentCount = 0;
        this.skippedCount = 0;
        this.labeledCount = 0;
    }

    start() {
        this.started = true;
        this.currentItem = this.loadedMessages[this.currentCount];
        this.currentItem.labeling_start_date = new Date();
    }

    skip() {
        if(!this.currentItem.skip_count) {
            this.currentItem.skip_count = 0;
        }
        this.skippedCount++;
        this.currentItem.skip_count++;
        this.sendItemAndGoNext();
    }

    find() {
        this.highlightedCharacters = [];
        const currentDescription = this.currentItem.description;
        for (let i = 0; i < currentDescription.length; i++) {
            const c = currentDescription.charAt(i);
            this.highlightedCharacters.push({char: c, is_highlighted: c >= '0' && c <= '9'});
        }
        if (this.highlightedCharacters.length === 0){
            this.highlightedCharacters = null;
        }
    }

    next() {
        this.currentItem.is_labeled = true;
        this.labeledCount++;
        this.sendItemAndGoNext();
    }
    sendItemAndGoNext() {
        this.currentItem.labeling_end_date = new Date();
        this.highlightedCharacters = null;
        this.sendItem();
        this.goNext();
    }
    sendItem() {
        this.dataService.sendItem(this.currentItem).subscribe(result => {
            // this.loadedMessages = loadedMessages;
        });
    }
    goNext() {
        if (this.currentCount + 1 === this.loadedMessages.length) {
            this.end();
        } else {
            this.currentCount++;
            this.currentItem = this.loadedMessages[this.currentCount];
            this.currentItem.labeling_start_date = new Date();
        }
    }

    private loadMessages() {
        this.dataService.loadMessages().subscribe(loadedMessages => {
            this.loadedMessages = loadedMessages;
        });
    }

    private loadCountries() {
        // this.dataService.loadAllCountries().subscribe(loadedCountries => {
        //     this.countries = loadedCountries;
        // });
    }

    private initYears() {
        this.years = [{id: 2019, name: "2019"}];
    }

    // private onComboboxSelect() {
    //     if (this.selectedCountry && this.selectedYear) {
    //         let country = this.getCountryFromList(this.selectedCountry);
    //         this.isLoading = true;
    //         this.dataService.loadHolidaysByCountry(country.code, this.selectedYear, country.languages[0])
    //             .subscribe(loadedHolidays => {
    //                 this.loadedHolidays = loadedHolidays;
    //                 this.isLoading = false;
    //             });
    //     }
    // }

    private getCountryFromList(countryName: string): CountryModel {
        return this.countries.find(item => item.name === countryName)
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl("/home");
    }

    exportData() {
        const accessToken = this.cookieService.get("access_token");
        let headers = new HttpHeaders({
            access_token: accessToken
            // accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = this.exportUrl;
        return this.http.get<Blob>(url, {
            headers: headers,
            observe: 'response',
            responseType: 'blob' as 'json'
        }).subscribe((response: any) => {
            const blob = new Blob([response.body], { type: 'application/octet-stream'});
            FileSaver.saveAs(response.body, 'export_data.xlsx');
        });
    }

    import(file: any): Observable<any> {
        // let headers = new HttpHeaders();
        // headers.append('Content-Type', 'multipart/form-data');
        let formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post(this.importUrl,
            formData,
            // {headers: headers, responseType: 'text'},
            // {responseType: 'text'}
        ).pipe(map((response: any) => {
                return true;
            }), catchError((err) => {
                return of(null);
            })
        );
    }

    public onFileChange(data: any) {
        this.showImportFailed = false;
        this.showImportSuccess = false;
        const file = data.target.files[0];
        data.target.value = '';
        this.import(file)
            .subscribe(result => {
                if (result) {
                    this.showImportSuccess = true;
                    setTimeout(() => this.showImportSuccess = false, 10000);
                } else {
                    this.showImportFailed = true;
                    setTimeout(() => this.showImportFailed = false, 10000);
                }
            });
    }

    public changeImportedFile() {
        this.importFileChooser.nativeElement.click();
    }

    @ViewChild('importFileChooserElement')
    public importFileChooser: ElementRef;
}
