using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.ViewModels.System.Account
{
    public class UserViewModel
    {
        public int? Id { get; set; }
        public string Userid { get; set; }
        public string Username { get; set; }
        public DateTime? Passwdexpr { get; set; }
        public string Adduserid { get; set; }
        public string Addusername { get; set; }
        public DateTime? Adddate { get; set; }
        public int? Delstat { get; set; }
    }
}
