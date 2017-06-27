using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebLogBase.Migrations
{
    public partial class GroupRights : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupRights",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Key = table.Column<string>(nullable: false),
                    Groupid = table.Column<int>(nullable: false),
                    Allowed = table.Column<short>(nullable: false),
                    Forbidden = table.Column<short>(nullable: false),
                    Adduserid = table.Column<int>(nullable: false),
                    Adddate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupRights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupRights_User_Adduserid",
                        column: x => x.Adduserid,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_GroupRights_Group_Groupid",
                        column: x => x.Groupid,
                        principalTable: "Group",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupRights_Adduserid",
                table: "GroupRights",
                column: "Adduserid");

            migrationBuilder.CreateIndex(
                name: "IX_GroupRights_Groupid",
                table: "GroupRights",
                column: "Groupid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupRights");
        }
    }
}
