using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.ViewModels.System.Account
{
    public class UserEditViewModel
    {
        public int? Id { get; set; }
        public string Userid { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
