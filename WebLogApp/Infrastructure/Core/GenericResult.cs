using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogApp.Infrastructure.Core
{
    public class GenericResult
    {
        public bool Succeeded { get; set; }
        public string Message { get; set; }
    }
}
