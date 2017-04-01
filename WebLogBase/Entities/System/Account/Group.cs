using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace WebLogBase.Entities.System.Account
{
    public class Group : IEntityBaseWithId, IEntityWithAdding, IEntityWithDelstat
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required]
        public string Name { get; set; }

        //[Required]
        [ForeignKey("Adduser")]
        public int? Adduserid { get; set; }
        [Required]
        public DateTime? Adddate { get; set; }
        [Required]
        public int? Delstat { get; set; }

        public virtual User Adduser { get; set; }

        [InverseProperty("Group")]
        public virtual ICollection<UserGroup> Users { get; set; }
    }
}
