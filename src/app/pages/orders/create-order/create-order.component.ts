import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { TypeClientI } from './../../../models/type-client.inteface';
import { OrdersService } from './../../../services/orders/orders.service';
import { TypeClientService } from './../../../services/type-client/type-client.service';
import { AuthService } from './../../../services/auth/auth.service';

import { ToastrService } from 'ngx-toastr';
// import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  private base64textString = [];
  private base64textStringPayOnline = [];
  private base64textStringLetter = [];

  public userData: {
    typeUser: number,
    idUser: number
  };

  public createOrder: FormGroup;

  public animation: boolean = false;
  public multiple: boolean = false;
  // private filesControlFirstPay = new FormControl(null, [FileUploadValidators.filesLimit(1)]);
  // private filesControlPayOnline = new FormControl(null, [Validators.required, FileUploadValidators.filesLimit(1)]);
  // private filesControlLetter = new FormControl(null, [FileUploadValidators.filesLimit(1)]);

  public codeClient: number = 0;
  public iTypeClient: Array<TypeClientI>;

  public currentQuotationForBuy: any;
  public typePay: boolean = true;

  constructor(private formBuilder: FormBuilder,
      private orderService: OrdersService,
      private typeclientService: TypeClientService,
      private authService: AuthService,
      private location: Location,
      private activatedRoute: ActivatedRoute,
      private toastr: ToastrService) {

      this.createOrder = this.formBuilder.group({
        code: [''],
        userCode: ['', Validators.required],
        codeClient: ['', Validators.required],
        nameClient: ['', Validators.required],
        tipo_cliente: ['', Validators.required],
        nombreTipoCliente: [''],
        codeCompany: ['', Validators.required],
        nombreEmpresa: [''],
        state: [1, Validators.required],
        montoTotal: [0, [Validators.min(0)]],
        firstPay: [0, [Validators.min(0)]],
        codeUser: [ JSON.parse(window.sessionStorage.getItem('validate')).code , Validators.required],
        /* changes */
        // pathFirstPay: this.filesControlFirstPay,
        // pathPayOnline: this.filesControlPayOnline,
        // letter: this.filesControlLetter,
        cost: [0, [Validators.min(1), Validators.required]],
        orderPay: [1, [Validators.required]],
        noCuotas: [0]
      });

  }

  ngOnInit(): void {
    this.userData = {
      typeUser: this.authService.getUserAuth().typeUser,
      idUser: this.authService.getUserAuth().code,
    }
    this.getAllTypeClient();
    this.activatedRoute.params.subscribe( res => {
      this.codeClient = res.code;
      this.getQuotation(this.codeClient);
    }, error => {
      let errors: any = error.error;
      this.toastr.error(errors.error, 'Error get data', {
          timeOut: 5000
      })
    });
  }

  getQuotation(code) {
    this.orderService.getQuotationById(1,this.userData.typeUser,this.userData.idUser, code).subscribe( response => {
      console.log(response);
      this.currentQuotationForBuy = response;
      this.createOrder.patchValue({
        codeClient: response?.codeClient,
        nameClient: response?.nameClient,
        montoTotal: Number(response?.amountTotal),
        firstPay: Number(response?.amountTotal) * 0.5,
        tipo_cliente: response?.tipo_cliente,
        nombreTipoCliente: this.getNameTipoCliente(response?.tipo_cliente),
        userCode: response?.codeUser,
        codeCompany: response?.codeCompany,
        nombreEmpresa: response?.company?.name,
        cost: response?.coustTotal
      });
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);

    });
  }

  getAllTypeClient() {
    this.typeclientService.getAllTypeClient().subscribe(res => {
      this.iTypeClient = res;
    }, error => {
      console.log(error)
    })
  }

  getNameTipoCliente(code: number){
    const { name } = this.iTypeClient.find( t => t.id == code);

    return name ?? ''
  }

  /* Carga de imagen para el primer pago */
  onUploadChange(evt: any) {
    const file = this.createOrder.value.pathFirstPay[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
      this.base64textString.length = 0;
      this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
  }

  /* Carga de imagen para el voucher compra tienda en linea */
  onUploadChangePayOnline(evt: any) {
    const file = this.createOrder.value.pathPayOnline[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoadedPayOnline.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoadedPayOnline(e) {
      this.base64textStringPayOnline.push('data:image/png;base64,' + btoa(e.target.result));
  }

  /* Carga de imagen para Carta de compromiso*/
  onUploadChangeLetter(evt: any) {
    const file = this.createOrder.value.letter[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoadedLetter.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoadedLetter(e) {
      this.base64textStringLetter.length = 0;
      this.base64textStringLetter.push('data:image/png;base64,' + btoa(e.target.result));
  }

  createNewOrder(event: Event) {
    event.preventDefault();
    if (this.createOrder.valid) {

        this.orderService.postOrder(this.createOrder.value,
              { first: this.base64textString, online: this.base64textStringPayOnline, letter: this.base64textStringLetter }
            ).subscribe(product => {
            this.backClicked();
            this.toastr.success('Pedido creada correctamente...', 'Pedido', {
                timeOut: 5000
            });

        }, error => {
            let errors: any = error.error
            this.toastr.error(errors.error, 'Error creating order', {
                timeOut: 10000
            })
        })

    } else {
        console.log(this.createOrder.value)
        this.toastr.error('You must select all the fields in order to generate a order ....', 'Error creating order', {
            timeOut: 10000
        })
    }
  }

  changeTypePay(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    if (value === "1") {
      this.typePay = true;
      this.createOrder.patchValue({
        noCuotas: 0,
        firstPay: Number(this.createOrder.get('montoTotal').value) * 0.5
      });
    } else {
      this.typePay = false;
      this.createOrder.patchValue({
        firstPay: 0
      });
    }
  }

  backClicked() {
    this.location.back();
  }

}
