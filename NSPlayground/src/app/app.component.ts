import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
//import * as firebase from "nativescript-plugin-firebase";

var firebase = require('nativescript-plugin-firebase');

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
    }

    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;

    public ngOnInit(): void {
        this.initializeFirebase();

        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    public get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    public isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    public onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    private initializeFirebase(): void {
        firebase.init({
            showNotifications: false,
            showNotificationsWhenInForeground: false

            // onPushTokenReceivedCallback: (token) => {
            //     console.log('[Firebase] onPushTokenReceivedCallback:', { token });
            // },

            // onMessageReceivedCallback: (message: firebase.Message) => {
            //     console.log('[Firebase] onMessageReceivedCallback:', { message });
            // }
        }).then(
            () => {
                console.log("[Firebase] Initalization done!");
            },
            error => {
                console.log(`[Firebase] Initialization error: ${error}`);
            }
        );
    }
}
