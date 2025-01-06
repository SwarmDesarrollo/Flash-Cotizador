export interface SaleI {
  code: number,
  codeUser: number,
  state: number,
  monto: number,
  urlPdf: string,
  nameClient: string,
  createdAt: Date,
  user: Object
}