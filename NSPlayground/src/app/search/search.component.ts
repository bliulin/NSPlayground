import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Grocery } from "../shared/models/grocery";
import { SearchService } from "./search.service";
import { Observable } from "rxjs";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "Search",
    templateUrl: "./search.component.html",
    providers: [SearchService]
})
export class SearchComponent implements OnInit {

    public groceries: ObservableArray<Grocery>;    

    constructor(private searchService: SearchService, 
        private router: Router,
        private route: ActivatedRoute) {
        this.groceries = new ObservableArray();
    }

    ngOnInit(): void {        
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    public async search(input: any): Promise<void> {        
        await this.searchByText(input.text);
    }

    private async searchByText(text: string): Promise<void> {
        const items = await this.searchService.search(text).toPromise();
        const filteredItems = items.filter(item => item.name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) >= 0);
        this.groceries.splice(0);
        this.groceries.push(filteredItems);
    }
}
