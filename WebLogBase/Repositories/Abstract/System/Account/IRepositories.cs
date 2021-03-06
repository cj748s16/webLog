﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities.System;
using WebLogBase.Entities.System.Account;

namespace WebLogBase.Repositories.System.Account
{
    public interface IUserRepository : IEntityBaseWithIdRepository<User>
    {
        Task AddAsync(User entity);
        Task ModifyAsync(User entity);
    }

    public interface IGroupRepository : IEntityBaseWithIdRepository<Group> { }

    public interface IGroupRightsRepository : IEntityBaseWithIdRepository<GroupRights>
    {
        Task<IEnumerable<GroupRightsView>> GroupRightsViewAsync(Expression<Func<GroupRightsView, bool>> predicate);
    }

    public interface IUserGroupRepository : IEntityBaseRepository<UserGroup>
    {
        /// <summary>
        /// Checks the user exists, and query the groups which is not assigned to the given user
        /// </summary>
        /// <param name="predicate">ug => ug.Userid == ?; where the ug is the UserGroup</param>
        Task<IEnumerable<Group>> AvailableByUserAsync(Expression<Func<UserGroup, bool>> predicate);
        /// <summary>
        /// Query the groups which is assgned to the given user
        /// </summary>
        /// <param name="predicate">ug => ug.Userid == ?; where the ug is the UserGroup</param>
        Task<IEnumerable<Group>> AssignedByUserAsync(Expression<Func<UserGroup, bool>> predicate);
    }

    public interface IRoleRepository : IEntityBaseWithIdRepository<Role> { }
}
