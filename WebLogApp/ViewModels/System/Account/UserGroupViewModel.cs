using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.ViewModels.System.Account
{
    public class UserGroupViewModel
    {
        public int? Userid { get; set; }
        public int? Groupid { get; set; }
        public string Username { get; set; }
        public string Groupname { get; set; }
        public int? Adduserid { get; set; }
        public string Addusername { get; set; }
        public DateTime? Adddate { get; set; }
    }
}
