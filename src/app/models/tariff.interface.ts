export interface TariffI {
    code: number,
    codeCategory: number,
    codeSubcategory: number,
    porcentage: number,
    category: { name: string },
    subcategory: { name: string }
}

export interface TariffsI {
    tariff: {
        count: number,
        rows: []
    }
}