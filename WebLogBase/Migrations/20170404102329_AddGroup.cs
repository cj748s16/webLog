using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebLogBase.Migrations
{
    public partial class AddGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Group",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: false),
                    Roleid = table.Column<int>(nullable: true),
                    Adduserid = table.Column<int>(nullable: true),
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

            migrationBuilder.CreateIndex(
                name: "IX_Group_Adduserid",
                table: "Group",
                column: "Adduserid");

            migrationBuilder.CreateIndex(
                name: "IX_Group_Roleid",
                table: "Group",
                column: "Roleid");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Group");
        }
    }
}
