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
    
    public partial class tbDecimoCuartoMes
    {
        public int dcm_IdDecimoCuartoMes { get; set; }
        public int hipa_IdHistorialDePago { get; set; }
        public System.DateTime dcm_FechaInicio { get; set; }
        public System.DateTime dcm_FechaFin { get; set; }
        public System.DateTime dcm_FechaPago { get; set; }
        public int dcm_Anio { get; set; }
        public int dcm_UsuarioCrea { get; set; }
        public System.DateTime dcm_FechaCrea { get; set; }
        public Nullable<int> dcm_UsuarioModifica { get; set; }
        public Nullable<System.DateTime> dcm_FechaModifica { get; set; }
        public bool dcm_Activo { get; set; }
    
        public virtual tbUsuario tbUsuario { get; set; }
        public virtual tbUsuario tbUsuario1 { get; set; }
        public virtual tbHistorialDePago tbHistorialDePago { get; set; }
    }
}
