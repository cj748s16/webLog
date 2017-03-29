using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogBase.Entities;
using WebLogBase.Entities.System.Account;

namespace WebLogBase.Infrastructure
{
    public class WebLogContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public WebLogContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.RemovePluralizingTableNameConventions();
            modelBuilder.RemoveManyToManyCascadeDeleteConvention();

            //modelBuilder.Entity<UserGroup>()
            //    .HasKey(c => new { c.Userid, c.Groupid });
        }
    }
}
