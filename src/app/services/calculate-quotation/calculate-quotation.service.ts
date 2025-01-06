import { Injectable, KeyValueDiffers } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class CalculateQuotationService {
    private calculateValueFob(price, shipping, tax) {
        let taxValue = price * (tax / 100)
        return price + shipping + taxValue;
    }

    private calculateValueCif(weight: number, valueFob: number, costPriceWeight: number, safe: number) {
        let newSafe: any = (safe / 100);
        let costWeight = (weight * costPriceWeight);
        let costSafe = (valueFob + costWeight) * newSafe;
        let total = (valueFob + costWeight + costSafe)
        return total;
    }

    private calculateTax(valueCif: number, tariff: number, iva: number) {
        let newTariff: any = (tariff / 100);
        let newIva: any = (iva / 100);
        let valueTariff: any = (valueCif * parseFloat(newTariff));
        let total: any = (parseFloat(valueTariff) + ((valueCif + parseFloat(valueTariff)) * parseFloat(newIva)))
        return parseFloat(total);
    }

    private calculateFreight(productWeight: number, costPriceWeight: number, customClearance: number, iva: number) {
        let weight: any = (productWeight * costPriceWeight);
        let newIva = (iva / 100);
        return (parseFloat(weight) + (parseFloat(weight) * newIva) + customClearance);
    }

    private calculateCostVariable(valorFob: number, impuestos: number, flete: number, porcentage: number, costoGanacia: number) {
        let sumatoria = (valorFob + impuestos + flete + costoGanacia);
        let total = (sumatoria * (porcentage / 100))
        return total
    }

    private calculateProfitMargin(valueProduct: number, freight: number, gain: number) {
        let total = ((valueProduct + freight) * (gain / 100))
        return total;
    }

    calculateQuotation(product, provider, settings, ListDiscount) {

        return new Promise((resolve, reject) => {
            /* Value fob  */
            let valueFob: number;
            let valueCif: number;
            let impuesto: number;
            let flete: number;
            let costoVariable: number;
            let pounds: number;



            if (product.typeWeight == 1)
                pounds = product.pounds

            if (product.typeWeight == 2) {
                let real = product.pounds;
                let volumetrico = (parseFloat(product.tall) * parseFloat(product.width) * (parseFloat(product.long))) / 166;
                if (real > volumetrico)
                    pounds = real;
                if (real < volumetrico)
                    pounds = volumetrico
                if (real === volumetrico)
                    pounds = real;
            }
            let m = pounds.toString().split(".");
            if (m.length > 1) {
                pounds = (pounds + (1 - parseFloat('0.' + m[1])));
            }

            if (product.tax == 1)
                valueFob = this.calculateValueFob((parseFloat(product.price) * parseFloat(product.quantity)), parseFloat(product.shipping), parseFloat(settings.tax))
            if (product.tax == 2)
                valueFob = this.calculateValueFob((parseFloat(product.price) * parseFloat(product.quantity)), parseFloat(product.shipping), 0)
            /* value cif -> temporaly*/
            valueCif = this.calculateValueCif(pounds, valueFob, settings.priceWeightCif, provider.safe);
            impuesto = this.calculateTax(valueCif, product.tariff, settings.iva)

            flete = this.calculateFreight(pounds, provider.priceWeight, provider.customClearence, settings.iva)
            let costoGanancia: number = this.calculateProfitMargin(valueFob, flete, settings.percentageProfit)
            costoVariable = this.calculateCostVariable(valueFob, impuesto, flete, settings.cardCost, costoGanancia)
            let taxPayment = (product.price < 1000) ? impuesto : (product.price >= 1000 && product.taxPayment == 1) ? impuesto : 0;
            let poliza = (product.price >= 1000) ? parseFloat(product.individualPoliceValue) : 0;
            if (product.applyDiscount == 1) {
                if (ListDiscount[0].typeCharger === '1') {
                    costoGanancia = costoGanancia - (costoGanancia * (ListDiscount[0].porcentage / 100));
                }
                if (ListDiscount[0].typeCharger === '2') {
                    costoGanancia = costoGanancia - ListDiscount[0].porcentage;
                }
            }
            let chargeOne: number = 0;
            let chargeTwo: number = 0;

            let chargeExtra: number = 0;
            if (parseFloat(product.price) >= 1000) {
                chargeOne = (product.surchargeOne !== null) ? parseFloat(product.surchargeOne) : 0;
                chargeTwo = (product.surchargeTwo !== null) ? parseFloat(product.surchargeTwo) : 0;
                chargeExtra = chargeOne + chargeTwo;
            }

            let subTotal = ((valueFob + taxPayment + flete + costoVariable + costoGanancia + chargeExtra + ((product.placeOfDelivery == 2) ? (settings.shippingGt) : 0) + poliza) * settings.priceChange).toFixed(2)
            let total = parseFloat(subTotal).toFixed(2);
            let n = total.split(".");
            if (n.length > 1) {
                total = (parseFloat(total) + (1 - parseFloat('0.' + n[1]))).toFixed(2);
            }
            let quotation = {
                valueFob: valueFob,
                valueCif: valueCif,
                quantity: product.quantity,
                tax: taxPayment,
                flete: flete,
                costoVariable: costoVariable,
                ganancia: costoGanancia,
                poliza: poliza,
                envioGt: (product.placeOfDelivery == 2) ? (settings.shippingGt) : 0,
                priceChange: settings.priceChange,
                subTotal: parseFloat(subTotal),
                total: total,
                pounds: pounds,
                chargeOne: chargeOne,
                chargeTwo: chargeTwo
            }
            if (parseFloat(total) >= 0) {
                return resolve(quotation);
            } else {
                return reject({ error: 'Error al calcular la cotización...' })
            }

        })
    }

}
