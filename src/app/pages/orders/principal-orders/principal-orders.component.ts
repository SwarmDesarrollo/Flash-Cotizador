import { Component, OnInit } from '@angular/core';

import { OrdersService } from './../../../services/orders/orders.service';
import { AuthService } from './../../../services/auth/auth.service';

@Component({
  selector: 'app-principal-orders',
  templateUrl: './principal-orders.component.html',
  styleUrls: ['./principal-orders.component.css']
})
export class PrincipalOrdersComponent implements OnInit {

  public orderBuy: number = 0;
  public orderStore: number = 0;
  public orderDelivered: number = 0;
  public orderValidated: number = 0;

  public userData: {
    typeUser: number,
    idUser: number
  };

  public quotations: [] = [];

  public state_quotation: string = '';
  public status_btn: boolean = false;

  constructor(private orderService: OrdersService, private authService: AuthService) { }

  ngOnInit(): void {
    
    this.userData = {
      typeUser: this.authService.getUserAuth().typeUser,
      idUser: this.authService.getUserAuth().code,
    }
    this.getQuotations();
    this.getOrdersBuy();
    this.getOrderStore();
    this.getOrderDelivered();
    this.getOrderValidated();
  }

  getQuotations() {
    this.orderService.getListQuotations(1,this.userData.typeUser,this.userData.idUser).subscribe( response => {
      this.quotations = response;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);

    });
  }

  getOrdersBuy() {
    this.orderService.getAllOrdersCount(1,this.userData.typeUser,this.userData.idUser, [1]).subscribe( response => {
      this.orderBuy = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getOrderStore() {
    this.orderService.getAllOrdersCount(1,this.userData.typeUser,this.userData.idUser, [2]).subscribe( response => {
      this.orderStore = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getOrderDelivered() {
    this.orderService.getAllOrdersCount(1,this.userData.typeUser,this.userData.idUser, [3]).subscribe( response => {
      this.orderDelivered = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getOrderValidated() {
    this.orderService.getAllOrdersCount(1,this.userData.typeUser,this.userData.idUser, [4]).subscribe( response => {
      this.orderValidated = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

}
