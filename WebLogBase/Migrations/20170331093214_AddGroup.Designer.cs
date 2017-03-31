﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using WebLogBase.Infrastructure;

namespace WebLogBase.Migrations
{
    [DbContext(typeof(WebLogContext))]
    [Migration("20170331093214_AddGroup")]
    partial class AddGroup
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("WebLogBase.Entities.System.Account.Group", b =>
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

                    b.HasKey("Id");

                    b.HasIndex("Adduserid");

                    b.ToTable("Group");
                });

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

            modelBuilder.Entity("WebLogBase.Entities.System.Account.Group", b =>
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
        }
    }
}
