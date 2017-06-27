using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebLogBase.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Userid = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Password = table.Column<byte[]>(nullable: false),
                    Salt = table.Column<byte[]>(nullable: false),
                    Passwdexpr = table.Column<DateTime>(nullable: false),
                    Adduserid = table.Column<int>(nullable: false),
                    Adddate = table.Column<DateTime>(nullable: false),
                    Delstat = table.Column<int>(nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_User_Adduserid",
                        column: x => x.Adduserid,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Adduserid = table.Column<int>(nullable: false),
                    Adddate = table.Column<DateTime>(nullable: false),
                    Delstat = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Role_User_Adduserid",
                        column: x => x.Adduserid,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Group",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false),
                    Roleid = table.Column<int>(nullable: false),
                    Adduserid = table.Column<int>(nullable: false),
                    Adddate = table.Column<DateTime>(nullable: false),
                    Delstat = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Group_User_Adduserid",
                        column: x => x.Adduserid,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Group_Role_Roleid",
                        column: x => x.Roleid,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserGroup",
                columns: table => new
                {
                    Userid = table.Column<int>(nullable: false),
                    Groupid = table.Column<int>(nullable: false),
                    Adduserid = table.Column<int>(nullable: false),
                    Adddate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroup", x => new { x.Userid, x.Groupid });
                    table.ForeignKey(
                        name: "FK_UserGroup_User_Adduserid",
                        column: x => x.Adduserid,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserGroup_Group_Groupid",
                        column: x => x.Groupid,
                        principalTable: "Group",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserGroup_User_Userid",
                        column: x => x.Userid,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Group_Adduserid",
                table: "Group",
                column: "Adduserid");

            migrationBuilder.CreateIndex(
                name: "IX_Group_Roleid",
                table: "Group",
                column: "Roleid");

            migrationBuilder.CreateIndex(
                name: "IX_Role_Adduserid",
                table: "Role",
                column: "Adduserid");

            migrationBuilder.CreateIndex(
                name: "IX_User_Adduserid",
                table: "User",
                column: "Adduserid");

            migrationBuilder.CreateIndex(
                name: "IX_UserGroup_Adduserid",
                table: "UserGroup",
                column: "Adduserid");

            migrationBuilder.CreateIndex(
                name: "IX_UserGroup_Groupid",
                table: "UserGroup",
                column: "Groupid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserGroup");

            migrationBuilder.DropTable(
                name: "Group");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
