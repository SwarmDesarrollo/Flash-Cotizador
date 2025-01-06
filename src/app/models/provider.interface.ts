import { NgbTime } from "@ng-bootstrap/ng-bootstrap/timepicker/ngb-time";

export interface ProviderI {
    name: string,
    priceWeight: number,
    weightLimit: number,
    safe: number,
    customClearence: number,
    shipping: number
}

export interface ProvidersI {
    count: number,
    rows: []
}