using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogBase.Entities.System.Account
{
    public class User : IEntityBaseWithId, IEntityWithAdding, IEntityWithDelstat
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required]
        public string Userid { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public byte[] Password { get; set; }
        [Required]
        public byte[] Salt { get; set; }
        [Required]
        public DateTime? Passwdexpr { get; set; }

        [Required]
        [ForeignKey("Adduser")]
        public int? Adduserid { get; set; }
        [Required]
        public DateTime? Adddate { get; set; }
        [Required]
        public int? Delstat { get; set; }

        public virtual User Adduser { get; set; }

        [InverseProperty("User")]
        public virtual ICollection<UserGroup> Groups { get; set; }

        [NotMapped]
        public string PasswordStr { get; set; }
    }
}
