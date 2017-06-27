using Microsoft.Extensions.Configuration;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.Text;

namespace WebLogBase.Infrastructure.Core
{
    public interface IStartup
    {
        void Configure(IConfigurationRoot configuration, Container container);
        void InitializeDatabase(Container container);
    }
}
