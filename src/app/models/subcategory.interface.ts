export interface SubcategoryI {
    code: number,
    codeCategory: number,
    name: string
    state: number,
    category: {
        name: string
    }
}

export interface SubcategorysI {
    count: number,
    rows: []
}