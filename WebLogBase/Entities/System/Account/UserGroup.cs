using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace WebLogBase.Entities.System.Account
{
    public class UserGroup : IEntityWithAdding
    {
        [ForeignKey("User")]
        public int? Userid { get; set; }
        [ForeignKey("Group")]
        public int? Groupid { get; set; }

        [Required]
        [ForeignKey("Adduser")]
        public int? Adduserid { get; set; }
        [Required]
        public DateTime? Adddate { get; set; }

        public virtual User User { get; set; }
        public virtual Group Group { get; set; }

        public virtual User Adduser { get; set; }
    }
}
