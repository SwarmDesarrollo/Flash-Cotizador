import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../services/quotation/quotation.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router } from '@angular/router'

const doc = new jsPDF({
	orientation: "portrait",
	unit: "mm",
	format: [216, 279.4], /* letter */
});


@Component({
	selector: 'app-quotation',
	templateUrl: './quotation.component.html',
	styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
	public dataPdf: any = {
		code: 0,
		name: "",
		phone: "",
		email: "",
		correlative: "",
		commentary: "",
		productQuotes: []
	};
	public products: Array<[]> = [];
	public total: number = 0.0;
	constructor(private quotationService: QuotationService, private activatedRoute: ActivatedRoute, private router: Router) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(data => {
			this.quotationService.getDataPDF(data.code).subscribe(res => {
				let prepdf: any = res;
				this.dataPdf = prepdf.preorder;
				for (let pq of this.dataPdf.productQuotes) {
					if (pq.product !== null) {
						this.total = this.total + pq.product.subTotal;
						this.products.push(pq.product)
					}
				}

			}, error => {
				console.log(error)
			})

			setTimeout(() => {
				this.generarPdf();
				this.router.navigate([`/view-quotation/${data.code}`])
			}, 3000)
		})
	}

	generarPdf() {
		var element = document.getElementById('quotation-pdf')
		html2canvas(element, { useCORS: true, scale: 1 }).then((canvas) => {
			console.log(canvas)
			var image = canvas.toDataURL('image/png');
			doc.addImage(image, 10, 10, 0, 0);
			doc.save('image.pdf')
		})
	}


}
