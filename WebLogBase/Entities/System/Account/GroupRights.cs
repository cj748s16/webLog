using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace WebLogBase.Entities.System.Account
{
    public class GroupRights : IEntityBaseWithId, IEntityWithAdding
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required]
        public string Key { get; set; }

        [Required]
        [ForeignKey("Group")]
        public int? Groupid { get; set; }

        [Required]
        public short? Allowed { get; set; }
        [Required]
        public short? Forbidden { get; set; }

        [Required]
        [ForeignKey("Adduser")]
        public int? Adduserid { get; set; }
        [Required]
        public DateTime? Adddate { get; set; }

        public virtual User AddUser { get; set; }

        public virtual Group Group { get; set; }
    }
}
