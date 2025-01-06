import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings/settings.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingI } from '../../models/settings.interface';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  public iSettings: SettingI;
  public formSettings: FormGroup;
  private category = [];
  private subcategory = [];
  private tariff = [];
  public codeSettings: number = 0;

  constructor(private settingsService: SettingsService, private formBuilder: FormBuilder, private toastrService: ToastrService, private spinner: NgxSpinnerService) {
    this.formSettings = this.utilsFormsSettings();
  }

  ngOnInit(): void {
    this.getSettings();
  }

  utilsFormsSettings() {
    return this.formBuilder.group({
      tax: ["", Validators.required],
      iva: ["", Validators.required],
      priceChange: ["", Validators.required],
      cardCost: ["", Validators.required],
      shippingGt: ["", Validators.required],
      percentageProfit: ["", Validators.required],
      priceWeightCif: ["", Validators.required]
    });
  }

  getSettings() {
    this.settingsService.getAllSettings().subscribe(settings => {
      this.codeSettings = settings.code;
      this.formSettings.patchValue({
        tax: settings.tax,
        iva: settings.iva,
        priceChange: settings.priceChange,
        cardCost: settings.cardCost,
        shippingGt: settings.shippingGt,
        percentageProfit: settings.percentageProfit,
        priceWeightCif: settings.priceWeightCif
      })
    }, error => {
    })
  }

  updateSettings(event: Event) {
    event.preventDefault();
    if (this.formSettings.valid) {
      this.settingsService.updateSettings(this.codeSettings, this.formSettings.value).subscribe(() => {
        this.toastrService.success('Settings updated successfully', 'Settings')
        this.getSettings();
      }, error => {
        let erros: any = error.error;
        this.toastrService.success(erros.error, 'Settings')
      })
    }
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];
    this.category = [];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
    this.category.push('data:application/vnd.ms-excel;base64,' + btoa(e.target.result));
  }

  onUploadChangeSubCategory(evt: any) {
    const file = evt.target.files[0];
    this.subcategory = [];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedSubcategory.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoadedSubcategory(e) {
    this.subcategory.push('data:application/vnd.ms-excel;base64,' + btoa(e.target.result));
  }

  onUploadChangeTariff(evt: any) {
    const file = evt.target.files[0];
    this.tariff = [];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedTariff.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoadedTariff(e) {
    this.tariff.push('data:application/vnd.ms-excel;base64,' + btoa(e.target.result));
  }

  bulkLoad() {
    this.spinner.show();
    if (this.category.length > 0) {
      this.settingsService.bulkLoad(this.category).subscribe(res => {
        this.spinner.hide();
        this.toastrService.success('Categories added successfully...', 'Settings')
      }, error => {
        this.spinner.hide();
        let errors: any = error.error;
        this.toastrService.error(`${errors.error}`, 'Error')
      })
    } else {
      this.spinner.hide();
      this.toastrService.error('You must select a file .CSV', 'Error', { timeOut: 10000 })
    }
  }

  bulkLoadSubcategory() {
    this.spinner.show();
    if (this.subcategory.length > 0) {
      this.settingsService.bulkLoadSubcategory(this.subcategory).subscribe(res => {
        this.spinner.hide();
        this.toastrService.success('Subcategories added successfully...', 'Settings')
      }, error => {
        this.spinner.hide();
        let errors: any = error.error;
        this.toastrService.error(`${errors.error}`, 'Error')
      })
    } else {
      this.spinner.hide();
      this.toastrService.error('You must select a file .CSV', 'Error', { timeOut: 10000 })
    }
  }

  bulkLoadTariff() {
    this.spinner.show();
    if (this.tariff.length > 0) {
      this.settingsService.bulkLoadTariff(this.tariff).subscribe(res => {
        this.spinner.hide();
        this.toastrService.success('Tariffs added correctly...', 'Settings')
      }, error => {
        this.spinner.hide();
        let errors: any = error.error;
        this.toastrService.error(`${errors.error}`, 'Error')
      })
    } else {
      this.spinner.hide();
      this.toastrService.error('You must select a file .CSV', 'Error', { timeOut: 10000 })
    }
  }
}
