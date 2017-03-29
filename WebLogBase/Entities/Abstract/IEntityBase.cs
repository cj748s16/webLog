using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogBase.Entities
{
    public interface IEntityBase
    {
    }

    public interface IEntityBaseWithId : IEntityBase
    {
        [Key, Column(Order = 0), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        int? Id { get; set; }
    }

    public interface IEntityWithAdding : IEntityBase
    {
        int? Adduserid { get; set; }
        [Required]
        DateTime? Adddate { get; set; }
    }

    public interface IEntityWithDelstat : IEntityBase
    {
        int? Delstat { get; set; }
    }
}
