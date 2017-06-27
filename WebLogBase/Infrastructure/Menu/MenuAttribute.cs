using System;
using System.Collections.Generic;
using System.Text;

namespace WebLogBase.Infrastructure.Menu
{
    [AttributeUsage(AttributeTargets.Class)]
    public class MenuAttribute : Attribute
    {
        public string Path { get; set; }
        public string Title { get; set; }
        public string Icon { get; set; }
        public int Order { get; set; } = -1;

        public MenuAttribute() { }

        public MenuAttribute(string path, string title)
        {
            Path = path;
            Title = title;
        }
    }
}
