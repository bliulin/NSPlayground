import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { WebView } from "tns-core-modules/ui/web-view/web-view";
import { WebViewInterface } from "nativescript-webview-interface";

import * as camera from "nativescript-camera";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import { Image } from "tns-core-modules/ui/image";
import { ImageSource } from "tns-core-modules/image-source/image-source";

@Component({
    selector: "KYC",
    templateUrl: "./kyc.component.html"
})
export class KYCComponent implements OnInit {

    @ViewChild("webView", { static: true })
    // tslint:disable-next-line: member-access
    public myWebView: ElementRef;

    constructor() {
        // Use the component constructor to inject providers.
    }

    private oLangWebViewInterface: WebViewInterface;

    public ngOnInit(): void {
        this.setupWebViewInterface();
    }

    public onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    private setupWebViewInterface(): void {
        const webView: WebView = this.myWebView.nativeElement;
        this.oLangWebViewInterface = new WebViewInterface(webView, 'https://bliulinstorage.z6.web.core.windows.net/');
        this.listenToActions();
    }

    private listenToActions(): void {
        this.oLangWebViewInterface.on('action', (actionName: string) => {
            // tslint:disable-next-line: no-empty
            if (actionName === 'takePhoto') {
                if (!camera.isAvailable()) {
                    alert('Camera is not available!');
                    return;
                }
                this.takePhoto().then((photo: string) => {
                    if (photo) {
                        this.oLangWebViewInterface.emit('photo', photo);
                    }
                });
            }
        });
    }

    private takePhoto(): Promise<any> {
        return camera.requestPermissions()
            .then(
                () => {
                    return this.doTakePicture();
                },
                (err: any) => {
                    console.log(err);
                });
    }

    private doTakePicture(): Promise<string> {
        return camera.takePicture()
            .then((imageAsset) => {
                const source = new ImageSource();
                return source.fromAsset(imageAsset)
                .then((s) => {
                    const base64Image = s.toBase64String("png", 60);
                    return base64Image;
                })
                .catch((err) => console.log('failed to get base64 from image asset'));
            })
            .catch((err) => {
                console.log("Error -> " + err.message);
                return null;
            });
    }
}
