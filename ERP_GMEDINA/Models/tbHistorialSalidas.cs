//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ERP_GMEDINA.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbHistorialSalidas
    {
        public int hsal_Id { get; set; }
        public int emp_Id { get; set; }
        public int tsal_Id { get; set; }
        public int rsal_Id { get; set; }
        public int pres_Id { get; set; }
        public System.DateTime hsal_FechaSalida { get; set; }
        public string hsal_Observacion { get; set; }
        public bool hsal_Estado { get; set; }
        public string hsal_RazonInactivo { get; set; }
        public int hsal_UsuarioCrea { get; set; }
        public System.DateTime hsal_FechaCrea { get; set; }
        public Nullable<int> hsal_UsuarioModifica { get; set; }
        public Nullable<System.DateTime> hsal_FechaModifica { get; set; }
    
        public virtual tbUsuario tbUsuario { get; set; }
        public virtual tbUsuario tbUsuario1 { get; set; }
        public virtual tbEmpleados tbEmpleados { get; set; }
        public virtual tbPrestaciones tbPrestaciones { get; set; }
        public virtual tbRazonSalidas tbRazonSalidas { get; set; }
        public virtual tbTipoSalidas tbTipoSalidas { get; set; }
    }
}
