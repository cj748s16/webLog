using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using WebLogBase.Infrastructure;

namespace WebLogBase.Migrations
{
    public partial class AddGroupRightsView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var script = @"
create view GroupRightsView as
select gr1.Id, u.Userid, gr1.[Key], gr1.Allowed, gr1.Forbidden
from [User] u (nolock)  
  outer apply (select distinct gr.[Key] 
    from [GroupRights] gr (nolock) 
      join [UserGroup] ug (nolock) on gr.Groupid = ug.Groupid
    where ug.Userid = u.Id) gr0
  outer apply (select top 1 gr.*
    from [GroupRights] gr (nolock)
      join [UserGroup] ug (nolock) on gr.Groupid = ug.Groupid
      join [Group] g (nolock) on g.Id = ug.Groupid
    where ug.Userid = u.Id
      and gr.[Key] = gr0.[Key]
    order by g.Roleid) gr1
where gr1.Id is not null
";
            migrationBuilder.Sql(script);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            var script = @"
drop view GroupRightsView
";
            migrationBuilder.Sql(script);
        }
    }
}
