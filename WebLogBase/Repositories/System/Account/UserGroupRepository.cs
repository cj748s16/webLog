using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities;
using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;

namespace WebLogBase.Repositories.System.Account
{
    public class UserGroupRepository : EntityBaseRepository<UserGroup>, IUserGroupRepository
    {
        public UserGroupRepository(WebLogContext context) : base(context)
        {
        }

        /// <summary>
        /// Checks the user exists, and query the groups which is not assigned to the given user
        /// </summary>
        /// <param name="predicate">ug => ug.Userid == ?; where the ug is the UserGroup</param>
        public virtual async Task<IEnumerable<Group>> AvailableByUserAsync(Expression<Func<UserGroup, bool>> predicate)
        {
            var condition = ConvertToSql(predicate);
            var userCondition = ReplaceAndConvertToSql<User>(predicate, u => u.Id);

            var sql = $@"select g.*
from [Group] g (nolock)
  left join [UserGroup] ug (nolock) on ug.Groupid = g.Id and {condition}
where ug.Groupid is null
  and exists(select 0 from [User] u (nolock) where {userCondition})
order by g.Name
";

            return await base.FromSql<Group>(sql).ToListAsync();
        }

        /// <summary>
        /// Query the groups which is assgned to the given user
        /// </summary>
        /// <param name="predicate">ug => ug.Userid == ?; where the ug is the UserGroup</param>
        public virtual async Task<IEnumerable<Group>> AssignedByUserAsync(Expression<Func<UserGroup, bool>> predicate)
        {
            var condition = ConvertToSql(predicate);

            var sql = $@"select g.*
from [Group] g (nolock)
  join [UserGroup] ug (nolock) on ug.Groupid = g.Id
where {condition}
order by g.Name
";

            return await base.FromSql<Group>(sql).ToListAsync();
        }
    }
}
