using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebLogBase.Infrastructure.Menu
{
    public class Menu
    {
        public string title { get; set; }
        public string icon { get; set; }
        public int? order { get; set; }
    }

    public class MenuData
    {
        public Menu menu { get; set; } = new Menu();
    }

    public class MenuItem
    {
        public string path { get; set; }
        public MenuData data { get; set; } = new MenuData();
        public MenuList children { get; set; } = new MenuList();

        [JsonIgnore]
        public bool ForceAdd { get; set; }
    }

    public class MenuList : List<MenuItem>
    {
        public MenuList() : base() { }

        public MenuList(IEnumerable<MenuItem> collection) : base(collection) { }
    }
}
