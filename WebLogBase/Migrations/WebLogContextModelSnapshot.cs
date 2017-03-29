using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using WebLogBase.Infrastructure;

namespace WebLogBase.Migrations
{
    [DbContext(typeof(WebLogContext))]
    partial class WebLogContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("WebLogBase.Entities.System.Account.User", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("Adddate")
                        .IsRequired();

                    b.Property<int?>("Adduserid");

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

            modelBuilder.Entity("WebLogBase.Entities.System.Account.User", b =>
                {
                    b.HasOne("WebLogBase.Entities.System.Account.User", "Adduser")
                        .WithMany()
                        .HasForeignKey("Adduserid");
                });
        }
    }
}
