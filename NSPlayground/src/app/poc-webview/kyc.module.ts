import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { Routes } from "@angular/router";
import { KYCComponent } from "./kyc.component";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", component: KYCComponent }
];

@NgModule({
    imports: [
        [NativeScriptRouterModule.forChild(routes)],
        NativeScriptCommonModule,        
    ],
    declarations: [
        KYCComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class KYCModule { }
