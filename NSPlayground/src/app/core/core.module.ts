import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({    
    imports: [
        NativeScriptHttpClientModule
    ],
    exports: [
        NativeScriptHttpClientModule
    ]    
})
export class CoreModule { }