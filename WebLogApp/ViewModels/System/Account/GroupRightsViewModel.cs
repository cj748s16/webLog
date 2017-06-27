using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.ViewModels.System.Account
{
    public class GroupRightsViewModel
    {
        public int? Id { get; set; }
        public string Key { get; set; }
        public int? Groupid { get; set; }
        public string Title { get; set; }
        public bool? Allowed { get; set; }
        public bool? Forbidden { get; set; }
    }

    public class GroupRightsDataViewModel
    {
        public int? GroupId { get; set; }

        public IEnumerable<GroupRightsViewModel> List { get; set; }
    }
}
