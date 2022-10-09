import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";
import {CountryModel} from "../models/country-model";
import {YearModel} from "../models/year-model";
import {HolidayModel} from "../models/holiday-model";
import {Message} from "../models/message-model";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Term} from "../models/term-model";
import {Find_popup} from "./find_popup/find_popup";
import {ModalController} from "@ionic/angular";
import {Label} from "../models/label-model";

@Component({
    selector: 'app-holidays',
    templateUrl: 'holidays.page.html',
    styleUrls: ['holidays.page.scss'],
})
export class HolidaysPage implements OnInit {
    public countries: CountryModel[];
    public selectedCountry: string;
    public years: YearModel[];
    public selectedYear: string;
    public isLoading = false;
    public loadedMessages: Message[];
    public loadedTerms: Term[];
    public matchedFinanceTerms: Term[];

    public loadedLabels: Label[];
    public filteredChildLabels: Label[];
    public loadedParentTypesSet: Set<any> = new Set();
    public loadedParentTypes: Array<any> = [];
    public matchedLabels: Label[];

    public labeledCount = 0;
    public skippedCount = 0;
    public currentCount = 0;
    public started = false;
    public labelRequiredValidation = false;
    public currentItem: Message = null;
    public highlightedCharacters: any[];

    public loadedHolidays: HolidayModel[] = [];

    public labelMode = true;
    public parentLabelType = null;

    modalDataResponse: any;

    constructor(private changeDetectorRef: ChangeDetectorRef, public modalCtrl: ModalController, private dataService: DataService, private router: Router, private authService: AuthService) {
        this.loadRelatedData();
    }

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
        this.parentLabelType = null;
    }

    start() {
        this.started = true;
        this.labelRequiredValidation = false;
        this.currentItem = this.loadedMessages[this.currentCount];
        this.currentItem.labeling_start_date = new Date();
        this.onTextChange();
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
        if(this.highlightedCharacters) {
            this.highlightedCharacters = null;
        } else {
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
    }
    async search() {
        const modal = await this.modalCtrl.create({
            component: Find_popup,
            componentProps: {
                'name': this.currentItem.description
            }
        });

        modal.onDidDismiss().then((modalDataResponse) => {
            if (modalDataResponse !== null) {
                this.modalDataResponse = modalDataResponse.data;
                console.log('Modal Sent Data : '+ modalDataResponse.data);
            }
        });

        return await modal.present();
    }

    next() {
        if (!this.currentItem.label) {
            this.labelRequiredValidation = true;
        } else {
            this.currentItem.is_labeled = true;
            this.labeledCount++;
            this.sendItemAndGoNext();
        }
    }
    sendItemAndGoNext() {
        this.currentItem.labeling_end_date = new Date();
        this.highlightedCharacters = null;
        this.parentLabelType = null;
        this.labelRequiredValidation = false;
        this.sendItem();
        this.goNext();
        this.onTextChange();
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

    public loadMessages() {
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

    private loadRelatedData() {
        this.dataService.loadTerms().subscribe(loadedTerms => {
            this.loadedTerms = loadedTerms;
        });
        this.dataService.loadLabels().subscribe(loadedLabels => {
            this.loadedLabels = loadedLabels;
            loadedLabels.forEach(item => {
                this.loadedParentTypesSet.add(item.parent);
            });
            this.loadedParentTypes = Array.from(this.loadedParentTypesSet.values());
        });

    }
    private onTextChange() {
       this.computeMatchedFinanceTerms();
       this.computeMatchedLabels();
    }
    private computeMatchedFinanceTerms() {
        this.matchedFinanceTerms = [];
        if (this.currentItem && this.currentItem.description) {
            this.loadedTerms.forEach(term => {
                if (this.currentItem.description.toLowerCase().indexOf(term.term.toLowerCase()) > -1) {
                    this.matchedFinanceTerms.push(term);
                }
            });
        }
    }
    private computeMatchedLabels() {
        this.matchedLabels = [];
        if (this.currentItem && this.currentItem.description) {
            this.loadedLabels.forEach(label => {
                for (const hint of label.hints) {
                    if (this.currentItem.description.toLowerCase().indexOf(hint.toLowerCase()) > -1) {
                        if (this.matchedLabels.indexOf(label) === -1){
                            this.matchedLabels.push(label);
                        }
                    }
                }
            });
        }
    }
    public onDescriptionChange(event: any) {
        this.currentItem.description = event;
        this.onTextChange();
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl("/home");
    }
    // ngAfterViewChecked(){
    //     //your code to update the model
    //     this.changeDetectorRef.detectChanges();
    // }

    onLabelChange(message: Message, label: Label) {
        // tslint:disable-next-line:triple-equals
        // event.preventDefault();
        if (message.label === label.label) {
            message.label = '';
        } else {
            message.label = label.label;
        }
        // this.changeDetectorRef.detectChanges();
        // this.changeDetectorRef.detectChanges();
        // setTimeout(() => this.changeDetectorRef.(), 1000);
    }

    onLabelTypeChange(label: any) {
        this.filteredChildLabels = [];
        this.currentItem.label = '';
        this.loadedLabels.forEach(item => {
            if (item.parent === this.parentLabelType) {
                this.filteredChildLabels.push(item);
            }
        });
    }
}
