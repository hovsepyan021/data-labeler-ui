import {Component, Input, OnInit} from "@angular/core";
import {ModalController} from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';


@Component({
    selector: 'app-find-popup',
    templateUrl: 'find_popup.html',
    styleUrls: ['find_popup.scss'],
})
export class Find_popup implements OnInit {
    @Input() name: string;
    dividedWords: any[] = [];

    constructor(
        private modalCtr: ModalController,
    ) { }

    ngOnInit() {
        this.divideWords();
    }

    divideWords() {
        this.dividedWords = this.name.split(' ').map(item => {
            return {word: item, is_selected: false};
        });
    }

    getQuery() {
        let query = "";
        this.dividedWords.forEach(item => {
            if(item.is_selected) {
                query = query + item.word + " ";
            }
        });
        return query.trim();
    }

    google() {
        window.open('http://google.com/search?q='+ this.getQuery());
    }

    bing() {
        window.open('https://www.bing.com/search?q='+ this.getQuery());
    }

    async close() {
        const closeModal: string = 'Modal Closed';
        await this.modalCtr.dismiss(closeModal);
    }

    closeModal() {
        this.close();
    }
}
