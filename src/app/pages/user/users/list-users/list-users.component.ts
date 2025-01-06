import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersI } from '../../../../models/users.interface';
import { UsersService } from '../../../../services/users/users.service';
declare var $

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  public iUser: Array<UsersI>

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe(res => {
      if (res.length > 0) {
        this.iUser = res;
        $(document).ready(function () {
          $('#users').DataTable({
            "language": {
              "sProcessing": "Procesando...",
              "sLengthMenu": "Mostrar _MENU_ registros",
              "sZeroRecords": "No se encontraron resultados",
              "sEmptyTable": "Ningún dato disponible en esta tabla",
              "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
              "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
              "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
              "sInfoPostFix": "",
              "sSearch": "Buscar:",
              "sUrl": "",
              "sInfoThousands": ",",
              "sLoadingRecords": "Cargando...",
              "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
              },
              "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
              }
            },
            retrieve: true,
            data: this.iUser
          });
        });
      } else {
        this.iUser = [];
      }
    }, error => {
      console.log(error)
    })
  }

}
