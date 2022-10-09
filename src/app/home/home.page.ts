import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    public username: string = "";
    public password: string = "";
    public invalidCredentials = false;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    public onLoginClick() {
        if (!this.isEmailValid(this.username)) {
            this.invalidCredentials = true;
            return;
        }
        this.authService.login(this.username, this.password).subscribe(loggedIn => {
            if (loggedIn) {
                if (loggedIn.is_admin) {
                    this.goToAdminScreen();
                } else {
                    this.goToApplication();
                }
                this.invalidCredentials = false;
            } else {
                this.invalidCredentials = true;
            }
        });
    }

    private isEmailValid(emailAddress: string): boolean {
        let emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegExp.test(emailAddress);
    }

    private goToApplication() {
        this.router.navigateByUrl("/data_labeler");
    }

    private goToAdminScreen() {
        this.router.navigateByUrl("/admin");
    }
}
