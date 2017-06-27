using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using WebLogBase.Entities.System.Account;

namespace WebLogBase.Entities.System
{
    public class GroupRightsView : IEntityBase
    {
        public int? Id { get; set; }

        public string Userid { get; set; }

        public string Key { get; set; }

        public short? Allowed { get; set; }
        public short? Forbidden { get; set; }
    }
}
