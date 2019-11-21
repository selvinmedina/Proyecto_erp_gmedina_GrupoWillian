using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ERP_GMEDINA.Models;

namespace ERP_GMEDINA.Controllers
{
    public class FormaPagoController : Controller
    {
        private ERP_GMEDINAEntities db = new ERP_GMEDINAEntities();

        // GET: FormaPago
        public ActionResult Index()
        {
            var tbFormaPago = db.tbFormaPago.Include(t => t.tbUsuario).Include(t => t.tbUsuario1).Where(p => p.fpa_Activo == true);
            return View(tbFormaPago.ToList());
        }

        //GET: DATA
        public ActionResult GetData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            //var tbTipoDeducciones = db.tbTipoDeduccion.ToList().Where(p => p.tde_Activo == true);

            //var tbPidoDedu = from d in db.tbTipoDeduccion
            //                 where

            var tbFormaPago = db.tbFormaPago
                .Select(c => new {
                    fpa_IdFormaPago = c.fpa_IdFormaPago,
                    fpa_Descripcion = c.fpa_Descripcion,
                    fpa_UsuarioCrea = c.fpa_UsuarioCrea,
                    NombreUsuarioCrea = c.tbUsuario.usu_NombreUsuario,
                    fpa_FechaCrea = c.fpa_FechaCrea,
                    fpa_UsuarioModifica = c.fpa_UsuarioModifica,
                    NombreUsuarioModifica = c.tbUsuario1.usu_NombreUsuario,
                    fpa_FechaModifica = c.fpa_FechaModifica,
                    fpa_Activo = c.fpa_Activo
                }).Where(x => x.fpa_Activo == true).ToList();

            return new JsonResult { Data = tbFormaPago, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Create([Bind(Include = "fpa_IdFormaPago,fpa_Descripcion,fpa_UsuarioCrea,fpa_FechaCrea")] tbFormaPago tbFormaPago)
        {
            //LLENAR LA DATA DE AUDITORIA, DE NO HACERLO EL MODELO NO SERÍA VÁLIDO Y SIEMPRE CAERÍA EN EL CATCH
            tbFormaPago.fpa_UsuarioCrea = 1;
            tbFormaPago.fpa_FechaCrea = DateTime.Now;
            //VARIABLE PARA ALMACENAR EL RESULTADO DEL PROCESO Y ENVIARLO AL LADO DEL CLIENTE
            string response = "bien";
            IEnumerable<object> listFormaPago = null;
            String MessageError = "";
            //VALIDAR SI EL MODELO ES VÁLIDO
            if (ModelState.IsValid)
            {
                try
                {
                    //EJECUTAR PROCEDIMIENTO ALMACENADO
                    listFormaPago = db.UDP_Plani_tbFormaPago_Insert(tbFormaPago.fpa_Descripcion,
                                                                            tbFormaPago.fpa_UsuarioCrea,
                                                                            tbFormaPago.fpa_FechaCrea);
                    //RECORRER EL TIPO COMPLEJO DEL PROCEDIMIENTO ALMACENADO PARA EVALUAR EL RESULTADO DEL SP                                                  
                    foreach (UDP_Plani_tbFormaPago_Insert_Result resultado in listFormaPago)
                        MessageError = Convert.ToString(resultado);

                    if (MessageError.StartsWith("-1"))
                    {
                        //EN CASO DE OCURRIR UN ERROR, IGUALAMOS LA VARIABLE "RESPONSE" A ERROR PARA VALIDARLO EN EL CLIENTE
                        ModelState.AddModelError("", "No se pudo ingresar el registro, contacte al administrador");
                        response = "error";
                    }
                }
                catch (Exception Ex)
                {
                    //EN CASO DE CAER EN EL CATCH, IGUALAMOS LA VARIABLE "RESPONSE" A ERROR PARA VALIDARLO EN EL CLIENTE
                    ModelState.AddModelError("", "No se pudo ingresar el registro, contacte al administrador");
                    response = "error" + Ex.Message.ToString();
                }
            }
            else
            {
                //SI EL MODELO NO ES VÁLIDO, IGUALAMOS LA VARIABLE "RESPONSE" A ERROR PARA VALIDARLO EN EL CLIENTE
                response = "error";
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Details(int? ID)
        {
            db.Configuration.ProxyCreationEnabled = false;

            tbFormaPago tbFormaPagoJSON = db.tbFormaPago.Find(ID);
            return Json(tbFormaPagoJSON, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Inactivar([Bind(Include = "fpa_IdFormaPago")] tbFormaPago tbFormaPago)
        {
            //LLENAR DATA DE AUDITORIA
            tbFormaPago.fpa_UsuarioModifica = 1;
            tbFormaPago.fpa_FechaModifica = DateTime.Now;
            //VARIABLE DONDE SE ALMACENARA EL RESULTADO DEL PROCESO
            string response = "bien";
            IEnumerable<object> listFormaPago = null;
            string MensajeError = "";
            //VALIDAR SI EL MODELO ES VÁLIDO
            if (ModelState.IsValid)
            {
                try
                {
                    //EJECUTAR PROCEDIMIENTO ALMACENADO
                    listFormaPago = db.UDP_Plani_tbFormaPago_Inactivar(tbFormaPago.fpa_IdFormaPago,
                                                                               tbFormaPago.fpa_UsuarioModifica,
                                                                               tbFormaPago.fpa_FechaModifica);

                    //RECORRER EL TIPO COMPLEJO DEL PROCEDIMIENTO ALMACENADO PARA EVALUAR EL RESULTADO DEL SP
                    foreach (UDP_Plani_tbFormaPago_Inactivar_Result Resultado in listFormaPago)
                        MensajeError = Resultado.MensajeError;

                    if (MensajeError.StartsWith("-1"))
                    {
                        //EN CASO DE OCURRIR UN ERROR, IGUALAMOS LA VARIABLE "RESPONSE" A ERROR PARA VALIDARLO EN EL CLIENTE
                        ModelState.AddModelError("", "No se pudo inactivar el registro, contacte al administrador");
                        response = "error";
                    }

                }
                catch (Exception Ex)
                {
                    //EN CASO DE CAER EN EL CATCH, IGUALAMOS LA VARIABLE "RESPONSE" A ERROR PARA VALIDARLO EN EL CLIENTE
                    response = Ex.Message.ToString();
                }
            }
            else
            {
                // SI EL MODELO NO ES CORRECTO, RETORNAR ERROR
                ModelState.AddModelError("", "No se pudo inactivar el registro, contacte al administrador.");
                response = "error";
            }

            //RETORNAR MENSAJE AL LADO DEL CLIENTE
            return Json(response, JsonRequestBehavior.AllowGet);
        }



        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
