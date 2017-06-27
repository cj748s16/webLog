using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities.System;
using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;

namespace WebLogBase.Repositories.System.Account
{
    public class GroupRightsRepository : EntityBaseWithIdRepository<GroupRights>, IGroupRightsRepository
    {
        public GroupRightsRepository(WebLogContext context) : base(context)
        {
        }

        /// <summary>
        /// Get group rights for user
        /// </summary>
        /// <param name="predicate">grv => grv.Userid == ?; where the grv is the GroupRightsView</param>
        /// <returns></returns>
        public async Task<IEnumerable<GroupRightsView>> GroupRightsViewAsync(Expression<Func<GroupRightsView, bool>> predicate)
        {
            var condition = ConvertToSql(predicate);

            var sql = $@"select grv.*
from [GroupRightsView] grv (nolock)
where {condition}
order by grv.[Userid], grv.[Key]
";

            return await base.FromSql<GroupRightsView>(sql).ToListAsync();
        }
    }
}
