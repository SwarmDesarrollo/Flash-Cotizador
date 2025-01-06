export interface ProductI {
    name: '',
    description: '',
    price: number,
    quantity: number,
    urlImage: string,/* pending */
    codeCategory: number,
    codeSubcategory: number,
    typeWeight: number,
    tariff: number,
    shipping: number,
    individualPoliceValue: number,
    taxPayment: number,
    applyDiscount: number,
    codeDiscount: number,
    deliveryGuy: string,
    deliveryTime: number,
    /* weight */
    pounds: number, /* libras */
    tall: number, /* alto */
    width: number,/* ancho */
    long: number,/* largo */
    /* weight */
    /* new charger */
    surchargeOne: number,
    descriptionOne: string,
    surchargeTwo: number,
    descriptionTwo: string,
    /* new charger */
    codeProvider: number,
    placeOfDelivery: number,/* Lugar de entrega */
    cardSurcharge: number, /* recargo de tarjeta */
    codeProductQuote: number /* asignacion de forma manual */
    subTotal: number
}