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
    
    public partial class tbMotivoLiquidaciones
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbMotivoLiquidaciones()
        {
            this.tbLiquidaciones = new HashSet<tbLiquidaciones>();
        }
    
        public int mliq_IdMotivoLiquidacion { get; set; }
        public string mliq_Descripcion { get; set; }
        public bool mliq_EsJustificado { get; set; }
        public int mliq_UsuarioCrea { get; set; }
        public System.DateTime mliq_FechaCrea { get; set; }
        public Nullable<int> mliq_UsuarioModifica { get; set; }
        public Nullable<System.DateTime> mliq_FechaModifica { get; set; }
        public bool mliq_Activo { get; set; }
    
        public virtual tbUsuario tbUsuario { get; set; }
        public virtual tbUsuario tbUsuario1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbLiquidaciones> tbLiquidaciones { get; set; }
    }
}
