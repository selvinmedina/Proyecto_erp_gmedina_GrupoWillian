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
    public class PlanillaController : Controller
    {
        private ERP_GMEDINAEntities db = new ERP_GMEDINAEntities();

        // GET: Planilla
        public ActionResult Index()
        {
            List<V_ColaboradoresPorPlanilla> colaboradoresPlanillas = db.V_ColaboradoresPorPlanilla.Where(x => x.CantidadColaboradores > 0).ToList();
            ViewBag.PlanillasColaboradores = colaboradoresPlanillas;
            ViewBag.colaboradoresGeneral = db.tbEmpleados.Count().ToString();
            return View(db.V_PreviewPlanilla.ToList());
        }

        public ActionResult GetPlanilla(int? ID)
        {
            List<V_PreviewPlanilla> PreviewPlanilla = new List<V_PreviewPlanilla>();

            if (ID != null)
                PreviewPlanilla = db.V_PreviewPlanilla.Where(x => x.cpla_IdPlanilla == ID).ToList();
            else
                PreviewPlanilla = db.V_PreviewPlanilla.ToList();
            return Json(PreviewPlanilla, JsonRequestBehavior.AllowGet);
        }

        // GET: Planilla/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            V_PreviewPlanilla v_PreviewPlanilla = db.V_PreviewPlanilla.Find(id);
            if (v_PreviewPlanilla == null)
            {
                return HttpNotFound();
            }
            return View(v_PreviewPlanilla);
        }

        public ActionResult GenerarPlanilla(int? idPlanilla)
        {
            using (ERP_GMEDINAEntities db = new ERP_GMEDINAEntities())
            {
                List<tbCatalogoDePlanillas> oIDSPlanillas = new List<tbCatalogoDePlanillas>();
                //INICIO DE LA TRANSACCION
                using (var dbContextTransaccion = db.Database.BeginTransaction())
                {
                    //ID DE TODAS LAS PLANILLAS, PARA PROCESARLAS 1 POR 1
                    if (idPlanilla != null)
                        oIDSPlanillas = db.tbCatalogoDePlanillas.ToList();
                    else
                        oIDSPlanillas = db.tbCatalogoDePlanillas.Where(X => X.cpla_IdPlanilla == idPlanilla).ToList();

                    //PROCESAR LAS PLANILLAS 1 POR 1
                    foreach (var iter in oIDSPlanillas)
                    {
                        try
                        {
                            //OBTENER PLANILLA ACTUAL
                            tbCatalogoDePlanillas oPlanilla = db.tbCatalogoDePlanillas.Find(iter.cpla_IdPlanilla);

                            //OBTENER LOS INGRESOS DE LA PLANILLA ACTUAL
                            V_PlanillaIngresos oIngresos = db.V_PlanillaIngresos.Find(oPlanilla.cpla_IdPlanilla);

                            //OBTENER LAS DEDUCCIONES DE LA PLANILLA ACTUAL
                            V_PlanillaDeducciones oDeducciones = db.V_PlanillaDeducciones.Find(oPlanilla.cpla_IdPlanilla);

                            //OBTNER LA LISTA DE EMPLEADOS QUE PERTENECEN A LA PLANILLA ACTUAL
                            List<tbEmpleados> oEmpleados = db.tbEmpleados.Where(emp => emp.cpla_IdPlanilla == oPlanilla.cpla_IdPlanilla).ToList();

                            //================== PROCESAR PLANILLA COLABORADOR POR COLABORADOR ==============================
                            foreach (var empleadoActual in oEmpleados)
                            {

                                //INFORMACION DEL COLABORADOR ACTUAL
                                V_InformacionColaborador InformacionDelEmpleadoActual = db.V_InformacionColaborador.Find(empleadoActual.emp_Id);

                                //EL SALARIO BASE LO PUSIERON COMO NVARCHAR :)
                                decimal SalarioBase = InformacionDelEmpleadoActual.SalarioBase;

                                //VARIABLES NECESARIAS PARA PROCESAR LA PLANILLA DEL COLABORADOR ACTUAL
                                decimal bonos = 0, comisiones = 0, otrosIngresos = 0, deduccionesPorInstitucionesFinancieras = 0, DeduccionesExtraordinarias = 0;

                                //OBTENER LAS DEDUCCIONES EXTRAS DEL COLABORADOR ACTUAL (SI LAS TIENE Y NO HA TERMINADO DE PAGARLAS)
                                List<V_DeduccionesExtrasColaboradores> oDeduccionesExtrasColaborador = db.V_DeduccionesExtrasColaboradores.Where(DEX => DEX.emp_Id== empleadoActual.emp_Id && DEX.dex_MontoRestante >0 && DEX.dex_Activo == true).ToList();

                                //VERIFICAR SI LA LISTA DE DEDUCCIONES EXTRAS DEL COLABORADOR NO VIENE NULA
                                if (!oDeduccionesExtrasColaborador?.Any()==true)
                                {
                                    //SI TIENE DEDUCCIONES EXTRAS, HAY QUE IR SUMANDOLAS TODAS
                                    foreach (var oDeduccionesExtrasColaboradorIterador in oDeduccionesExtrasColaborador)
                                    {
                                        DeduccionesExtraordinarias += oDeduccionesExtrasColaboradorIterador.dex_Cuota;
                                        //CÓDIGO PARA RESTAR LA CUOTA PAGADA DE LA CANTIDAD RESTANTE DE LA DEDUCCIÓN
                                        oDeduccionesExtrasColaboradorIterador.dex_MontoRestante = oDeduccionesExtrasColaboradorIterador.dex_MontoRestante - oDeduccionesExtrasColaboradorIterador.dex_Cuota;
                                        db.Entry(oDeduccionesExtrasColaboradorIterador).State = EntityState.Modified;
                                    }
                                    db.SaveChanges();
                                }


                                //OBTENER LAS DEDUCCIONES POR INSTITUCIONES FINANCIERAS DEL COLABORADOR ACTUAL
                                List<V_DeduccionesInstitucionesFinancierasColaboradres> oDeduInstiFinancieras = db.V_DeduccionesInstitucionesFinancierasColaboradres.Where(x => x.emp_Id == empleadoActual.emp_Id && x.deif_Activo == true).ToList();
                                
                                //VERIFICAR SI LA LISTA DE DEDUCCIONES POR INSTITUCIONES FINANCIERAS DEL COLABORADOR NO VIENE NULA
                                if (!oDeduInstiFinancieras?.Any() == true)
                                {
                                    //SI TIENE DEDUCCIONES DE INSTITUCIONES FINANCIERAS, HAY QUE IR SUMANDOLAS TODAS
                                    foreach (var oDeduInstiFinancierasIterador in oDeduInstiFinancieras)
                                    {
                                        deduccionesPorInstitucionesFinancieras += oDeduInstiFinancierasIterador.deif_Monto;
                                        //CÓDIGO PARA RESTAR LA CUOTA PAGADA DE LA CANTIDAD RESTANTE DE LA DEDUCCIÓN
                                    }
                                }





                            }
                            db.SaveChanges();
                            //COMMIT A LA TRANSACCION
                            dbContextTransaccion.Commit();
                        }
                        catch
                        {
                            // SI ALGO FALLA, HACER UN ROLLBACK
                            dbContextTransaccion.Rollback();
                        }
                    }
                }

            }
            return View();
        }

        // GET: Planilla/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Planilla/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "emp_Id,Nombres,per_Identidad,per_Sexo,per_Edad,per_Direccion,per_Telefono,per_CorreoElectronico,per_EstadoCivil,salarioBase,tmon_Id,tmon_Descripcion,cpla_IdPlanilla,cpla_DescripcionPlanilla")] V_PreviewPlanilla v_PreviewPlanilla)
        {
            if (ModelState.IsValid)
            {
                db.V_PreviewPlanilla.Add(v_PreviewPlanilla);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(v_PreviewPlanilla);
        }

        // GET: Planilla/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            V_PreviewPlanilla v_PreviewPlanilla = db.V_PreviewPlanilla.Find(id);
            if (v_PreviewPlanilla == null)
            {
                return HttpNotFound();
            }
            return View(v_PreviewPlanilla);
        }

        // POST: Planilla/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "emp_Id,Nombres,per_Identidad,per_Sexo,per_Edad,per_Direccion,per_Telefono,per_CorreoElectronico,per_EstadoCivil,salarioBase,tmon_Id,tmon_Descripcion,cpla_IdPlanilla,cpla_DescripcionPlanilla")] V_PreviewPlanilla v_PreviewPlanilla)
        {
            if (ModelState.IsValid)
            {
                db.Entry(v_PreviewPlanilla).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(v_PreviewPlanilla);
        }

        // GET: Planilla/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            V_PreviewPlanilla v_PreviewPlanilla = db.V_PreviewPlanilla.Find(id);
            if (v_PreviewPlanilla == null)
            {
                return HttpNotFound();
            }
            return View(v_PreviewPlanilla);
        }

        // POST: Planilla/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            V_PreviewPlanilla v_PreviewPlanilla = db.V_PreviewPlanilla.Find(id);
            db.V_PreviewPlanilla.Remove(v_PreviewPlanilla);
            db.SaveChanges();
            return RedirectToAction("Index");
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
