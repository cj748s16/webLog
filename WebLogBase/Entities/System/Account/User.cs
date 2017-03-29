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
        [Key, Column(Order = 0), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }

        [Required, Column(Order = 1)]
        public string Userid { get; set; }
        [Required, Column(Order = 2)]
        public string Name { get; set; }
        [Required, Column(Order = 3)]
        public byte[] Password { get; set; }
        [Required, Column(Order = 4)]
        public byte[] Salt { get; set; }
        [Required, Column(Order = 5)]
        public DateTime? Passwdexpr { get; set; }
        //[Required]
        [Column(Order = 5)]
        [ForeignKey("Adduser")]
        public int? Adduserid { get; set; }
        [Required, Column(Order = 6)]
        public DateTime? Adddate { get; set; }
        [Required, Column(Order = 7)]
        public int? Delstat { get; set; }

        public virtual User Adduser { get; set; }

        //[InverseProperty("User")]
        //public virtual ICollection<UserGroup> Groups { get; set; }

        [NotMapped]
        public string PasswordStr { get; set; }
    }
}
