using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.ViewModels.System.Account
{
    public class GroupViewModel
    {
        public int? Id { get; set; }
        public string Groupname { get; set; }
        public int? Adduserid { get; set; }
        public string Addusername { get; set; }
        public DateTime? Adddate { get; set; }
        public int? Delstat { get; set; }
    }
}
