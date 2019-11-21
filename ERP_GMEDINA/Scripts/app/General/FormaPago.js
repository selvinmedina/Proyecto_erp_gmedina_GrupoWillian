var IDInactivar = 0;
//
//OBTENER SCRIPT DE FORMATEO DE FECHA
//
$.getScript("../Scripts/app/General/SerializeDate.js")
  .done(function (script, textStatus) {
      console.log(textStatus);
  })
  .fail(function (jqxhr, settings, exception) {
      console.log("No se pudo recuperar Script SerializeDate");
  });

//FUNCION GENERICA PARA REUTILIZAR AJAX
function _ajax(params, uri, type, callback) {
    $.ajax({
        url: uri,
        type: type,
        data: { params },
        success: function (data) {
            callback(data);
        }
    });
}

//FUNCION: CARGAR DATA Y REFRESCAR LA TABLA DEL INDEX
function cargarGridFormaPago() {
    _ajax(null,
        '/FormaPago/GetData',
        'GET',
        (data) => {
            console.log(data);
            if (data.length == 0) {
                //Validar si se genera un error al cargar de nuevo el grid
                iziToast.error({
                    title: 'Error',
                    message: 'No se pudo cargar la información, contacte al administrador',
                });
            }
            //GUARDAR EN UNA VARIABLE LA DATA OBTENIDA
            var ListaFormaPago = data, template = '';
            //RECORRER DATA OBETINA Y CREAR UN "TEMPLATE" PARA REFRESCAR EL TBODY DE LA TABLA DEL INDEX
            for (var i = 0; i < ListaFormaPago.length; i++) {
                var FechaCrea = FechaFormato(ListaFormaPago[i].fpa_FechaCrea);

                var FechaModifica = FechaFormato(ListaFormaPago[i].fpa_FechaModifica);

                UsuarioModifica = ListaFormaPago[i].tde_UsuarioModifica == null ? 'Sin modificaciones' : ListaFormaPago[i].NombreUsuarioModifica;

                template += '<tr data-id = "' + ListaFormaPago[i].fpa_IdFormaPago + '">' +
                    '<td>' + ListaFormaPago[i].fpa_Descripcion + '</td>' +
                    '<td>' + ListaFormaPago[i].NombreUsuarioCrea + '</td>' +
                    '<td>' + FechaCrea + '</td>' +
                    '<td>' + UsuarioModifica + '</td>' +
                    '<td>' + FechaModifica + '</td>' +
                    '<td>' +
                    '<button data-id = "' + ListaFormaPago[i].fpa_IdFormaPago + '" type="button" class="btn btn-primary btn-xs" id="btnEditarFormaPago">Editar</button>' +
                    //'<button data-id = "' + ListaFormaPago[i].fpa_IdFormaPago + '" type="button" class="btn btn-default btn-xs" id="btnDetalleFormaPago">Detalle</button>' +
                    '</td>' +
                    '</tr>';
            }
            //REFRESCAR EL TBODY DE LA TABLA DEL INDEX
            $('#tbodyFormaPago').html(template);
        });
}

//FUNCION: PRIMERA FASE DE AGREGAR UN NUEVO REGISTRO, MOSTRAR MODAL DE CREATE
$(document).on("click", "#btnAgregarFormaPago", function () {
    //MOSTRAR EL MODAL DE AGREGAR
    $("#CrearFormaPago").modal();
    $("#Crear #fpa_Descripcion").val("");
});

//FUNCION: CREAR UN NUEVO REGISTRO
$('#btnRegistrarFormaPago').click(function () {
    console.log("Entra al click de crear");
    // SIEMPRE HACER LAS RESPECTIVAS VALIDACIONES DEL LADO DEL CLIENTE
    $("#CrearFormaPago #Validation_descripcion").css("display", "block");
    //SERIALIZAR EL FORMULARIO DEL MODAL (ESTÁ EN LA VISTA PARCIAL)
    var data = $("#frmCreateFormaPago").serializeArray();
    //SE VALIDA QUE EL CAMPO DESCRIPCION ESTE INICIALIZADO PARA NO IR AL SERVIDOR INNECESARIAMENTE
    //if ($("#CrearFormaPago #fpa_Descripcion").val()) {
        //ENVIAR DATA AL SERVIDOR PARA EJECUTAR LA INSERCIÓN
        $.ajax({
            url: "/FormaPago/Create",
            method: "POST",
            data: data
        }).done(function (data) {
            //VALIDAR RESPUESTA OBETNIDA DEL SERVIDOR, SI LA INSERCIÓN FUE EXITOSA O HUBO ALGÚN ERROR
            if (data == "error") {
                console.log("Entro a la excepcion de AJAX");
                iziToast.error({
                    title: 'Error',
                    message: 'No se pudo guardar el registro, contacte al administrador',
                });
            }
            else {
                $("#CrearFormaPago").modal('hide');
                cargarGridFormaPago();
                // Mensaje de exito cuando un registro se ha guardado bien
                iziToast.success({
                    title: 'Exito',
                    message: '¡Se registró de forma exitosa!',
                });
            }
        });
    //}
});

//FUNCION: MOSTRAR DETALLES DEL REGISTRO
$(document).on("click", "#tblFormaPago tbody tr td #btnDetalleFormaPago", function () {
    var ID = $(this).data('id');
    console.log(ID + " ID detalles forma de pago");
    $.ajax({
        url: "/FormaPago/Details/" + ID,
        method: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ ID: ID })
    })
        .done(function (data) {
            //SI SE OBTIENE DATA, LLENAR LOS CAMPOS DEL MODAL CON ELLA
            if (data) {
                var FechaCrea = FechaFormato(data.fpa_FechaCrea);
                var FechaModifica = FechaFormato(data.fpa_FechaModifica);
                $("#Detalles #fpa_IdFormaPago").val(data.fpa_IdFormaPago);
                $("#Detalles #fpa_Descripcion").val(data.fpa_Descripcion);
                $("#Detalles #fpa_UsuarioCrea").val(data.fpa_UsuarioCrea);
                $("#Detalles #fpa_FechaCrea").val(FechaCrea);
                $("#Detalles #fpa_UsuarioModifica").val(data.fpa_UsuarioModifica);
                $("#Detalles #fpa_FechaModifica").val(FechaModifica);

                $("#DetallesFormaPago").modal();
            }
            else {
                //Mensaje de error si no hay data
                iziToast.error({
                    title: 'Error',
                    message: 'No se pudo cargar la información, contacte al administrador',
                });
            }
        });
});

//EJECUTAR INACTIVACION DEL REGISTRO EN EL MODAL
//$("#btnInactivarFormaPago").click(function () {
//    var IdEmpleado = $("#Detalles #fpa_IdFormaPago").val();
//    var data = $("#frmFormaPagoInactivar").serializeArray();
//    //SE ENVIA EL JSON AL SERVIDOR PARA EJECUTAR LA EDICIÓN
//    $.ajax({
//        url: "/FormaPago/Inactivar",
//        method: "POST",
//        data: data
//    }).done(function (data) {
//        if (data == "error") {
//            //Cuando traiga un error del backend al guardar la edicion
//            iziToast.error({
//                title: 'Error',
//                message: 'No se pudo inactivar el registro, contacte al administrador',
//            });
//        }
//        else {
//            // REFRESCAR UNICAMENTE LA TABLA
//            cargarGridFormaPago();
//            //UNA VEZ REFRESCADA LA TABLA, SE OCULTA EL MODAL
//            $("#InactivarFormaPago").modal('hide');
//            //Mensaje de exito de la edicion
//            iziToast.success({
//                title: 'Exito',
//                message: '¡El registro fue Inactivado de forma exitosa!',
//            });
//        }
//    });
//});


//EJECUTAR INACTIVACION DEL REGISTRO EN EL MODAL
//$("#btnInactivarFormaPago").click(function () {
//    console.log("A entrado en el boton para inactivar");
//    var ID = $("#Detalles #fpa_IdFormaPago").val();
    
//    console.log(' serializacion del ID ' + ID);

//    $.ajax({
//        url: "/FormaPago/Inactivar/" + ID,
//        method: "GET",
//        dataType: "json",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify({ ItbFormaPagoD: ID })
//    })
//        .done(function (data) {
//            if (data == "error") {
//                //Cuando traiga un error del backend al guardar la edicion
//                iziToast.error({
//                    title: 'Error',
//                    message: 'No se pudo inactivar el registro, contacte al administrador',
//                });
//            }
//            else {
//                // REFRESCAR UNICAMENTE LA TABLA
//                cargarGridFormaPago();
//                //UNA VEZ REFRESCADA LA TABLA, SE OCULTA EL MODAL
//                $("#InactivarFormaPago").modal('hide');
//                //Mensaje de exito de la edicion
//                iziToast.success({
//                    title: 'Exito',
//                    message: '¡El registro fue Inactivado de forma exitosa!',
//                });
//            }
//        });
//});


//EJECUTAR INACTIVACION DEL REGISTRO EN EL MODAL
$("#btnInactivarFormaPago").click(function () {

    var data = $("#frmFormaPagoInactivar").serializeArray();
    //SE ENVIA EL JSON AL SERVIDOR PARA EJECUTAR LA EDICIÓN
    $.ajax({
        url: "/FormaPago/Inactivar/",
        method: "POST",
        data: data
    }).done(function (data) {
        if (data == "error") {
            //Cuando traiga un error del backend al guardar la edicion
            iziToast.error({
                title: 'Error',
                message: 'No se pudo inactivar el registro, contacte al administrador',
            });
        }
        else {
            // REFRESCAR UNICAMENTE LA TABLA
            cargarGridFormaPago();
            //UNA VEZ REFRESCADA LA TABLA, SE OCULTA EL MODAL
            $("#InactivarFormaPago").modal('hide');
            //Mensaje de exito de la edicion
            iziToast.success({
                title: 'Exito',
                message: 'El registro fue Inactivado de forma exitosa!',
            });
        }
    });
});














//MOSTRAR EL MODAL DE DETALLES
$(document).on("click", "#btnDetalleFormaPago", function () {
    $("#DetallesFormaPago").modal();
});

//MOSTRAR EL MODAL DE INACTIVAR
$(document).on("click", "#btnmodalInactivarFormaPago", function () {
    $("#DetallesFormaPago").modal('hide');
    $("#InactivarFormaPago").modal();
});

//Boton para cerrar el modal de Inactivar
$("#btnCerrarInactivacion").click(function () {
    $("#InactivarFormaPago").modal('hide');
});











//FUNCION: OCULTAR MODAL DE CREACION
$("#btnCerrarCrear").click(function () {
    $("#CrearFormaPago #Validation_descripcion").css("display", "none");
});

//FUNCION: OCULTAR MODAL DE EDICION
$("#btnCerrarEditar").click(function () {
    $("#EditarTipoDeducciones").modal('hide');
    $("#EditarFormaPago #Validation_descripcion").css("display", "none");
});

//FUNCION: OCULTAR MODAL DE CREACION CON EL ICONO DE CERRAR OCULTANDO EL DATAANNOTATION
$("#IconCerrarCrear").click(function () {
    $("#CrearFormaPago #Validation_descripcion").css("display", "none");
});

//FUNCION: OCULTAR MODAL DE EDICION CON EL ICONO DE CERRAR OCULTANDO EL DATAANNOTATION
$("#IconCerrarEditar").click(function () {
    $("#EditarFormaPago #Validation_descripcion").css("display", "none");
});

//FUNCION: HABILITAR EL DATAANNOTATION AL DESPLEGAR EL MODAL
$("#btnCerrar").click(function () {
    $("#EditarTipoDeducciones").modal('hide');
    $("#EditarFormaPago #Validation_descripcion").css("display", "none");
});