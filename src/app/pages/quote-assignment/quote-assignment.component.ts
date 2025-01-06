import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../services/quotation/quotation.service';
import { UsersService } from '../../services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

declare var $;
@Component({
    selector: 'app-quote-assignment',
    templateUrl: './quote-assignment.component.html',
    styleUrls: ['./quote-assignment.component.css']
})
export class QuoteAssignmentComponent implements OnInit {
    public iListQuotation: Array<[]>;
    public listUsers: {};
    public codeUser: string = '';
    public userData: {
      typeUser:null,
      idUser:null
    };

    constructor(private quotationService: QuotationService, private userService: UsersService, private toast: ToastrService) { }

    ngOnInit(): void {

        this.userData = {
          typeUser: JSON.parse(window.sessionStorage.getItem('validate')).typeUser,
          idUser: JSON.parse(window.sessionStorage.getItem('validate')).code,
        }
        this.getQuote();
        this.userService.getAllUser().subscribe(res => {
            let user = res.filter(u => (u.state === 1)).map(u => { return { code: u.code, username: u.username } })
            this.listUsers = user;
        }, error => {
            let errors: any = error;
            this.toast.error(errors.error, 'Error get users', { timeOut: 10000 })
        })

    }
    getQuote() {
        this.quotationService.getListQuotation(0,this.userData.typeUser,this.userData.idUser).subscribe(res => {
            this.iListQuotation = res.rows;
            if (res.count > 0) {
                $(document).ready(function () {
                    $('#quoteAssignment').DataTable({
                        "language": {
                            "processing": "Procesando...",
                            "lengthMenu": "Mostrar _MENU_ registros",
                            "zeroRecords": "No se encontraron resultados",
                            "emptyTable": "Ningún dato disponible en esta tabla",
                            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "infoPostFix": "",
                            "search": "Buscar:",
                            "url": "",
                            "thousands": ",",
                            "loadingRecords": "Cargando...",
                            "paginate": {
                                "first": "Primero",
                                "last": "Último",
                                "next": "Siguiente",
                                "previous": "Anterior"
                            },
                            "aria": {
                                "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                                "sortDescending": ": Activar para ordenar la columna de manera descendente"
                            }
                        },
                        retrieve: true,
                        data: this.iListQuotation
                    });
                });
            } else {
                this.iListQuotation = [];
            }
        }, error => {
            let errors: any = error;
            this.toast.error(errors.error, 'Error get quote', { timeOut: 10000 })
        })
    }

    changeUserQuotation(codeQuotation, codeUser) {
        Swal.fire({
            title: 'Esta seguro de realizar la asignacion...',
            showDenyButton: true ,
            showCancelButton: false,
            confirmButtonText: `Continuar`,
            denyButtonText: `Cancelar`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                this.codeUser = '';
                this.quotationService.updateClient({ code: parseInt(codeQuotation), codeUser: parseInt(codeUser) }).subscribe(res => {
                    let quote: any = res;
                    $(document).ready(function () { $('#quoteAssignment').DataTable().destroy(); })
                    this.toast.success(quote.preorder, 'Update quote', { timeOut: 5000 })
                    this.getQuote();
                }, error => {
                    let errors: any = error;
                    this.toast.error(errors.error, 'Error get quote', { timeOut: 10000 })
                })
            }
        })

    }

}
