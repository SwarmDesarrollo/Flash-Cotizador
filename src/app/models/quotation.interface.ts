export interface viewQuotationI {
    code: number,
    name: string,
    state: number
}

export interface ProductQuotesI {
    code: number,
    link: string,
    commentary: string,
    state: number
}

export interface QuotationI {
  code: number,
  correlative: string,
  name: string,
  email: string,
  phone: string,
  state: number,
  tipo_cliente: string,
  codeDiscount: number,
  codeDiscountWeight: number,
  cardCharge: number,
  codeUser: string,
  disc_nPorcentage: number,
  disc_nPorcentageWeight: number,
  disc_nTypeCharge: string,
  disc_nTypeChargeWeight: number,
  shippingCharge: string,
  typeShippingGt: string,
  codeCompany: number,
  productQuotes: [ProductQuotesI],
  showData?: number
}


export interface ListQuotationI {
    count: number,
    rows: []

}

export interface PreorderI {
    code: number,
    name: string,
    phone: string,
    email: string,
    correlative: string,
    state: string,

}
