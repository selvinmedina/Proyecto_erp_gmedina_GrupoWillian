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
    
    public partial class tbTipoDeduccion
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tbTipoDeduccion()
        {
            this.tbCatalogoDeDeducciones = new HashSet<tbCatalogoDeDeducciones>();
        }
    
        public int tde_IdTipoDedu { get; set; }
        public string tde_Descripcion { get; set; }
        public int tde_UsuarioCrea { get; set; }
        public System.DateTime tde_FechaCrea { get; set; }
        public Nullable<int> tde_UsuarioModifica { get; set; }
        public Nullable<System.DateTime> tde_FechaModifica { get; set; }
        public bool tde_Activo { get; set; }
    
        public virtual tbUsuario tbUsuario { get; set; }
        public virtual tbUsuario tbUsuario1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tbCatalogoDeDeducciones> tbCatalogoDeDeducciones { get; set; }
    }
}
