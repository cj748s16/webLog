using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogBase.Entities;
using WebLogBase.Entities.System;
using WebLogBase.Entities.System.Account;

namespace WebLogBase.Infrastructure
{
    public class WebLogContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupRights> GroupRights { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }

        // TODO: Add-Migration MigrationName -IgnoreChanges
        // Views
        private DbSet<GroupRightsView> _GroupRightsView { get; set; }
        public IQueryable<GroupRightsView> GroupRigthtsView
        {
            get
            {
                return Set<GroupRightsView>().AsNoTracking();
            }
        }

        public WebLogContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.RemovePluralizingTableNameConventions();
            modelBuilder.RemoveManyToManyCascadeDeleteConvention();

            modelBuilder.Entity<UserGroup>()
                .HasKey(c => new { c.Userid, c.Groupid });
        }
    }
}
