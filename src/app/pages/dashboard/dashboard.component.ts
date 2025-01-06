// import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public quotationPending: number = 0;
  public quotationWorkInProgress: number = 0;
  public bestCategory: [];
  public firstQuotation: [];
  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getQuotationPending();
    this.getWorkInProgress();
    this.getBestCategory();
    this.getFirstQuotation();
  }

  getQuotationPending() {
    this.dashboardService.getQuotationPending().subscribe(res => {
      let pending: any = res;
      this.quotationPending = pending.quotationPending;
    }, error => {
      console.log(error)
    })
  }

  getWorkInProgress() {
    this.dashboardService.getWorkInProgress().subscribe(res => {
      let inProgress: any = res;
      this.quotationWorkInProgress = inProgress.workInProgress;
    }, error => {
      console.log(error)
    })
  }

  getBestCategory() {
    this.dashboardService.getBestCategory().subscribe(res => {
      let best: any = res;
      this.bestCategory = best;
    }, error => {
      console.log(error)
    })
  }

  getFirstQuotation() {
    this.dashboardService.getFirstQuotation().subscribe(res => {
      let first: any = res;
      this.firstQuotation = first;
    }, error => {
      console.log(error)
    })
  }

}
