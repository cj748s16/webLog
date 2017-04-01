using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebLogBase.Migrations
{
    public partial class AddUserGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserGroup",
                columns: table => new
                {
                    Userid = table.Column<int>(nullable: false),
                    Groupid = table.Column<int>(nullable: false),
                    Adduserid = table.Column<int>(nullable: true),
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
        }
    }
}
