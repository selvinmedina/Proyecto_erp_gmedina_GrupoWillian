//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ERP_GMEDINA.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbAuxilioDeCesantias
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbAuxilioDeCesantias()
        {
            this.tbLiquidaciones = new HashSet<tbLiquidaciones>();
        }
    
        public int aces_IdAuxilioCesantia { get; set; }
        public int aces_RangoInicioMeses { get; set; }
        public int aces_RangoFinMeses { get; set; }
        public int aces_DiasAuxilioCesantia { get; set; }
        public int aces_UsuarioCrea { get; set; }
        public System.DateTime aces_FechaCrea { get; set; }
        public Nullable<int> aces_UsuarioModifica { get; set; }
        public Nullable<System.DateTime> aces_FechaModifica { get; set; }
        public bool aces_Activo { get; set; }
    
        public virtual tbUsuario tbUsuario { get; set; }
        public virtual tbUsuario tbUsuario1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbLiquidaciones> tbLiquidaciones { get; set; }
    }
}