using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using WebLogBase.Infrastructure;

namespace WebLogBase.Migrations
{
    [DbContext(typeof(WebLogContext))]
    [Migration("20170627103225_AddGroupRightsView")]
    partial class AddGroupRightsView
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("WebLogBase.Entities.System.Account.Group", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Adddate")
                        .IsRequired();

                    b.Property<int?>("Adduserid")
                        .IsRequired();

                    b.Property<int?>("Delstat")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int?>("Roleid")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Adduserid");

                    b.HasIndex("Roleid");

                    b.ToTable("Group");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.GroupRights", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Adddate")
                        .IsRequired();

                    b.Property<int?>("Adduserid")
                        .IsRequired();

                    b.Property<short?>("Allowed")
                        .IsRequired();

                    b.Property<short?>("Forbidden")
                        .IsRequired();

                    b.Property<int?>("Groupid")
                        .IsRequired();

                    b.Property<string>("Key")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Adduserid");

                    b.HasIndex("Groupid");

                    b.ToTable("GroupRights");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.Role", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Adddate")
                        .IsRequired();

                    b.Property<int?>("Adduserid")
                        .IsRequired();

                    b.Property<string>("Code")
                        .IsRequired();

                    b.Property<int?>("Delstat")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Adduserid");

                    b.ToTable("Role");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.User", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Adddate")
                        .IsRequired();

                    b.Property<int?>("Adduserid")
                        .IsRequired();

                    b.Property<int?>("Delstat")
                        .IsRequired();

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<DateTime?>("Passwdexpr")
                        .IsRequired();

                    b.Property<byte[]>("Password")
                        .IsRequired();

                    b.Property<byte[]>("Salt")
                        .IsRequired();

                    b.Property<string>("Userid")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("Adduserid");

                    b.ToTable("User");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.UserGroup", b =>
                {
                    b.Property<int?>("Userid");

                    b.Property<int?>("Groupid");

                    b.Property<DateTime?>("Adddate")
                        .IsRequired();

                    b.Property<int?>("Adduserid")
                        .IsRequired();

                    b.HasKey("Userid", "Groupid");

                    b.HasIndex("Adduserid");

                    b.HasIndex("Groupid");

                    b.ToTable("UserGroup");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.GroupRightsView", b =>
                {
                    b.Property<int?>("Id");

                    b.Property<short?>("Allowed");

                    b.Property<short?>("Forbidden");

                    b.Property<string>("Key");

                    b.Property<string>("Userid");

                    b.HasKey("Id");

                    b.ToTable("GroupRightsView");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.Group", b =>
                {
                    b.HasOne("WebLogBase.Entities.System.Account.User", "Adduser")
                        .WithMany()
                        .HasForeignKey("Adduserid");

                    b.HasOne("WebLogBase.Entities.System.Account.Role", "Role")
                        .WithMany("Groups")
                        .HasForeignKey("Roleid");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.GroupRights", b =>
                {
                    b.HasOne("WebLogBase.Entities.System.Account.User", "AddUser")
                        .WithMany()
                        .HasForeignKey("Adduserid");

                    b.HasOne("WebLogBase.Entities.System.Account.Group", "Group")
                        .WithMany()
                        .HasForeignKey("Groupid");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.Role", b =>
                {
                    b.HasOne("WebLogBase.Entities.System.Account.User", "Adduser")
                        .WithMany()
                        .HasForeignKey("Adduserid");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.User", b =>
                {
                    b.HasOne("WebLogBase.Entities.System.Account.User", "Adduser")
                        .WithMany()
                        .HasForeignKey("Adduserid");
                });

            modelBuilder.Entity("WebLogBase.Entities.System.Account.UserGroup", b =>
                {
                    b.HasOne("WebLogBase.Entities.System.Account.User", "Adduser")
                        .WithMany()
                        .HasForeignKey("Adduserid");

                    b.HasOne("WebLogBase.Entities.System.Account.Group", "Group")
                        .WithMany("Users")
                        .HasForeignKey("Groupid");

                    b.HasOne("WebLogBase.Entities.System.Account.User", "User")
                        .WithMany("Groups")
                        .HasForeignKey("Userid");
                });
        }
    }
}
