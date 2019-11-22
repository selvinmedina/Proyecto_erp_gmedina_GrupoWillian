//Declaracion de variables

//Obtener las URL
var pathname = window.location.pathname + '/',
    URLactual = window.location.toString(),
    getUrl = window.location,
    baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1],
    table;//Almacenar la tabla


//Constantes
const btnGuardar = $('#btnGuardarCatalogoDePlanillasIngresosDeducciones'), //Boton para guardar el catalogo de planilla con sus detalles
    btnEditar = $('#btnEditarCatalogoDePlanillasIngresosDeducciones'), //Boton para editar editar el catalogo de planilla con sus detalles
    validacionDescripcionPlanilla = $('#validacionDescripcionPlanilla'), //Mensaje de validacion para la descripcion de la planilla
    validacionFrecuenciaDias = $('#validacionFrecuenciaDias'), //Mensaje de validación para la frecuencia en días
    validacionCatalogoIngresos = $('#catalogoDeIngresos #validacionCatalogoIngresos'), //Mensaje de validación de los ingresos
    htmlBody = $('html, body'), //Seleccionar el HTML y el body
    validacionCatalogoDeducciones = $('#catalogoDeDeducciones #validacionCatalogoDeducciones'), //Mensaje de validación de las deducciones
    inputDescripcionPlanilla = $('#cpla_DescripcionPlanilla'), //Seleccionar la descripción de la planilla
    inputFrecuenciaEnDias = $('#cpla_FrecuenciaEnDias'), //Seleccionar el campo de frecuencia en días
    inputIdPlanilla = $('form #cpla_IdPlanilla'), //Seleccionar el id de la planilla (esta oculto)
    cargandoCrear = $('#cargandoCrear'), //Div que aparecera cuando se le de click en crear
    cargandoEditar = $('#cargandoEditar'); //Div que aparecera cuando se de click en editar
//Funciones
//Funcion generica para reutilizar AJAX
function _ajax(params, uri, type, callback, enviar) {
    $.ajax({
        url: uri,
        type: type,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(params),
        beforeSend: function () {
            enviar();
        },
        success: function (data) {
            callback(data);
        }
    });
}

//Mostrar el spinner
function spinner() {
    return `<div class="sk-spinner sk-spinner-wave">
                <div class="sk-rect1"></div>
                <div class="sk-rect2"></div>
                <div class="sk-rect3"></div>
                <div class="sk-rect4"></div>
                <div class="sk-rect5"></div>
             </div>`
}

//Posicionaarse en la parte superior de la pagina cuando falle una validación
function scrollArriba() {
    htmlBody.animate({ scrollTop: 60 }, 300);
}

//Cuando cargue entonces que liste los datos en la tabla
$(document).ready(() => {
    if (getUrl.toString().indexOf('Create') < 1 && getUrl.toString().indexOf('Edit') < 1) {
        listar();
    }

    //Validar que no haya un /Index en la URL, si no falla el AJAX
    let ubicacionIndexUrl = URLactual.indexOf('/Index');
    if (ubicacionIndexUrl > 0) {
        location.href = URLactual.replace('/Index', '');
    }

    //Validar la descripción de la planilla cuando se salga del input
    inputDescripcionPlanilla.blur(function () {
        if ($(this).val() != "") {
            validacionDescripcionPlanilla.hide();
        } else {
            validacionDescripcionPlanilla.show();
        }
    });

    //Validar la frecuencia en dias cuando se salga del input
    inputFrecuenciaEnDias.blur(function () {
        if (inputFrecuenciaEnDias.val() != "" && inputFrecuenciaEnDias.val() != "0" && inputFrecuenciaEnDias.val() > 0) {
            validacionFrecuenciaDias.hide();
        } else {
            validacionFrecuenciaDias.show();
        }
    });


});
//Datatables
function listar() {
    //Almacenar la tabla creada
    table = $('.dataTables-example').DataTable({//Con este metodo se le dan los estilos y funcionalidades de datatable a la tabla
        'destroy': true, //Es para que pueda volver a inicializar el datatable, aunque ya este creado
        "ajax": { //Hacer la peticion asíncrona y obtener los datos que se mostraran en el datatable
            'method': 'GET',
            'url': 'CatalogoDePlanillas/getPlanilla',
            'contentType': 'application/json; charset=utf-8',
            'dataType': 'json'
        },
        'columns': [
            {//Columna 1: el boton de desplegar
                "className": 'details-control', //Estos estilos estan en: Content/app/General
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            { 'data': 'descripcionPlanilla' }, //Columna 2: descripción de la planilla, esto viene de la petición que se hizo al servidor
            { 'data': 'frecuenciaDias' }, //Columna 3: frecuencia en días de la planilla, esto viene de la petición que se hizo al servidor
            {//Columna 4: los botones que tendrá cada fila, editar y detalles de la planilla
                'defaultContent':
                    `
                        <button type="button" class="btn btn-primary btn-xs" id="btnEditarCatalogoDeducciones">Editar</button>
                        <button type="button" class="btn btn-default btn-xs" id="btnDetalleCatalogoDeducciones">Detalle</button>
                    `
            }
        ],
        "language": { "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json" },//Con esto se hace la traducción al español del datatables
        responsive: false,
        pageLength: 25,
        dom: '<"html5buttons"B>lTfgitp', //Darle los elementos del DOM que deseo
        buttons: [ //Poner los botones que quiero que aparezcan
            { extend: 'copy' },
            {
                extend: 'csv',
                title: 'Catalogo de Planillas',
                exportOptions: {
                    columns: [1, 2]
                }
            },
            {
                extend: 'excelHtml5',
                title: 'Catalogo de Planillas',
                exportOptions: {
                    columns: [1, 2]
                }
            },
            {
                extend: 'pdfHtml5',
                title: 'Catalogo de Planillas',
                exportOptions: {
                    columns: [1, 2]
                }
            },

            {
                extend: 'print',
                title: 'Catalogo de Planillas',
                exportOptions: {
                    columns: [1, 2]
                },
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]
    });
    //Cuando le de click en detalles, o editar, le pasare el id
    obtenerIdDetallesEditar('#tblCatalogoPlanillas tbody', table);
}

//Redireccionar a Edit o Details
function obtenerIdDetallesEditar(tbody, table) {
    //Validar bien que la URL esté bien
    if (pathname == '//')
        pathname = baseUrl;

    if (pathname.toString().indexOf('CatalogoDePlanillas') < 1)
        pathname += 'CatalogoDePlanillas/';

    //Cuando de click en editar, que obtenga el id del tr, y que redireccione a la pantalla de Edit
    $(tbody).on('click', 'button#btnEditarCatalogoDeducciones', function () {
        var data = table.row($(this).parents('tr')).data();
        location.href = pathname + 'Edit/' + data.idPlanilla;
    });

    //Cuando de click en detalles, que obtenga el id del tr, y que redireccione a la pantalla de Details
    $(tbody).on('click', 'button#btnDetalleCatalogoDeducciones', function () {
        var data = table.row($(this).parents('tr')).data();
        location.href = pathname + 'Details/' + data.idPlanilla;
    });
}

//Plantilla del detalle de ingresos de la planilla
function getIngresos(data) {
    var ingresosPlanillas = `
    <div class="col-lg-6">
       <div class="ibox-title">
            <h5>Ingresos de la Planilla</h5>
        </div>
        <div class="ibox-content">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Ingreso</th>
                    </tr>
                </thead>
                <tbody>`;
    $.each(data.ingresos, function (index, val) {
        ingresosPlanillas += `
                        <tr>
                            <td>
                                `+ val.cin_DescripcionIngreso + `
                            </td>
                        </tr>
                    `
    });
    ingresosPlanillas += `</tbody>
            </table>
        </div>
    </div>`;

    return ingresosPlanillas;
}

//Plantilla del detalle de deducciones de la planilla
function getDeducciones(data) {
    var deduccionesPlanilla = `
    <div class="col-lg-6">
       <div class="ibox-title">
            <h5>Deducciones de la Planilla</h5>
        </div>
        <div class="ibox-content">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Deducción</th>
                    </tr>
                </thead>
                <tbody>`;
    $.each(data.deducciones, function (index, val) {
        deduccionesPlanilla += `
                        <tr>
                            <td>
                                `+ val.cde_DescripcionDeduccion + `
                            </td>
                        </tr>
                    `
    });
    deduccionesPlanilla += `</tbody>
            </table>
        </div>
    </div>`;

    return deduccionesPlanilla;
}

//Para desplegar los detalles de la planilla
function obtenerDetalles(id, handleData) {
    _ajax(null,
        '/CatalogoDePlanillas/getDeduccionIngresos/' + id,
        'GET',
        data => handleData(data),
        () => { }
    );
}

//Cuando de click en el botón de detalles
$(document).on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = table.row(tr);

    //Que cierre el detalle
    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    } else { //Que desplegue el detalle
        row.child([spinner()]).show();
        tr.addClass('shown');

        // Obtener los datos para el detalle
        obtenerDetalles(row.data().idPlanilla, (data) => {
            //Mostrar el detalle con sus datos
            row.child([getIngresos(data) + getDeducciones(data)]).show();
            tr.addClass('shown');
        },
            () => { });
    }
});

//Insertar, editar y eliminar
// Si esta en la pantalla de Create entonces vaciar todo
if (getUrl.toString().indexOf('Create') > 1) {
    $('input[type="checkbox"]').prop("checked", false);
    inputDescripcionPlanilla.val('');
    inputFrecuenciaEnDias.val('')
}

//Insetar
$(document).on('click', '#btnGuardarCatalogoDePlanillasIngresosDeducciones', function () {
    crearEditar();
});

//Editar
$(document).on('click', '#btnEditarCatalogoDePlanillasIngresosDeducciones', function () {
    crearEditar('edit');
});


//Para editar o insertar utilizare esta función, para validar los campos
function verificarCampos(descripcionPlanilla, frecuenciaDias, catalogoIngresos, catalogoDeducciones) {
    var todoBien = true;
    //Validar que la descripción este bien
    if (descripcionPlanilla == "") {
        scrollArriba();
        validacionDescripcionPlanilla.show();
        todoBien = false;
    } else
        validacionDescripcionPlanilla.hide();
    //Validar que la frecuencia en días esté bien
    if (frecuenciaDias == "" || parseInt(frecuenciaDias) <= 0) {
        scrollArriba();
        validacionFrecuenciaDias.show();
        todoBien = false;
    } else
        validacionFrecuenciaDias.hide();

    //Validar que se haya seleccionado por lo menos un ingreso
    if (catalogoIngresos.length == 0) {
        scrollArriba();
        validacionCatalogoIngresos.show();
        todoBien = false;
    } else
        validacionCatalogoIngresos.hide();

    //Validar qeu por lo meno se halla seleccionado una deducción
    if (catalogoDeducciones.length == 0) {
        scrollArriba();
        validacionCatalogoDeducciones.show();
        todoBien = false;
    } else
        validacionCatalogoDeducciones.hide();

    return todoBien;
}

// Funcion para crear y editar
var crearEditar = function (edit) {
    //Array de Ingresos y deducciones
    var arrayIngresos = [];
    var arrayDeducciones = [];
    //Obtener los valores del catalogo de planillas
    var descripcionPlanilla = inputDescripcionPlanilla.val();
    var frecuenciaDias = inputFrecuenciaEnDias.val();
    var idPlanilla = inputIdPlanilla.val();
    //Obtener las lista del catalogo de ingresos
    $('#catalogoDeIngresos input[type="checkbox"]').each(function (index, val) {

        //Obtener el atributo id del ckeckbox
        let checkId = $(val).attr('id');

        //Separar el id por el caracter "-"
        let arr = checkId.split('-');

        //Obtener el id del checkbox para identificar el id de los ingresos a guardar
        let currentCheckboxIdIngreso = arr[1];

        //Ver si esta chequeado o no para guardar solo los que esten chequeados
        let isChecked = $('#catalogoDeIngresos #check-' + currentCheckboxIdIngreso).is(':checked', true);

        //Agregar a la lista de ingresos
        if (isChecked) {
            arrayIngresos.push(currentCheckboxIdIngreso);
        }
    });

    //Obtener las lista del catalogo de deducciones
    $('#catalogoDeDeducciones input[type="checkbox"]').each(function (index, val) {
        //Obtener el atributo id del ckeckbox
        let checkIdDedu = $(val).attr('id');

        //Separar el id por el caracter "-"
        let arrDedu = checkIdDedu.split('-');

        //Obtener el id del checkbox para identificar el id de los ingresos a guardar
        let currentCheckboxIdDedu = arrDedu[1];

        //Ver si esta chequeado o no para guardar solo los que esten chequeados
        let isCheckedDedu = $('#catalogoDeDeducciones #check-' + currentCheckboxIdDedu).is(':checked', true);

        //Agregar a la lista de
        if (isCheckedDedu === true) {
            arrayDeducciones.push(currentCheckboxIdDedu);
        }
    });

    //Insertar o editar
    if (verificarCampos(descripcionPlanilla, frecuenciaDias, arrayIngresos, arrayDeducciones)) {
        if (!edit) {
            btnGuardar.hide();
            cargandoCrear.html(spinner());
            cargandoCrear.show();

            _ajax({
                catalogoDePlanillas: [
                    descripcionPlanilla, frecuenciaDias
                ],
                catalogoIngresos: arrayIngresos,
                catalogoDeducciones: arrayDeducciones
            },
                "/CatalogoDePlanillas/Create",
                "POST",
                (data) => {
                    if (data == "bien") {
                        iziToast.success({
                            title: 'Exito',
                            message: 'El registro fue insertado de forma exitosa.',
                        });
                        location.href = baseUrl;
                    }
                    else {
                        iziToast.error({
                            title: 'Error',
                            message: 'Hubo un error al insertar el registro',
                        });

                        btnGuardar.show();
                        cargandoCrear.html('');
                        cargandoCrear.hide();
                    }
                },
                enviar => { });
        }
        else {
            btnEditar.hide();
            cargandoEditar.html(spinner());
            cargandoEditar.show();
            _ajax({
                id: idPlanilla,
                catalogoDePlanillas: [
                    descripcionPlanilla, frecuenciaDias
                ],
                catalogoIngresos: arrayIngresos,
                catalogoDeducciones: arrayDeducciones
            },
                "/CatalogoDePlanillas/Edit",
                "POST",
                (data) => {
                    if (data == "bien") {
                        iziToast.success({
                            title: 'Exito',
                            message: 'El registro fue editado de forma exitosa.',
                        });
                        location.href = baseUrl;
                    }
                    else {
                        iziToast.error({
                            title: 'Error',
                            message: 'Hubo un error al editar el registro',
                        });
                        btnEditar.show();
                        cargandoEditar.html('');
                        cargandoEditar.hide();
                    }
                },
                enviar => { });
        }
    }
}

//Inactivar
$('#inactivar').click(() => {
    $('#InactivarCatalogoDeducciones').modal();
});

$('#InactivarCatalogoDeducciones #btnInactivarPlanilla').click(() => {
    var id = inputIdPlanilla.val();
    _ajax({ id: id },
        '/CatalogoDePlanillas/Delete',
        'POST',
        (data) => {
            if (data == "bien") {
                iziToast.success({
                    title: 'Exito',
                    message: 'El registro fue inactivado de forma exitosa.',
                });
                location.href = baseUrl;
            } else {
                iziToast.error({
                    title: 'Error',
                    message: 'Ocurrió un error',
                });
            }
        },
        enviar => { console.log('Enviando...'); });
});