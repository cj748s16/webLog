using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities.System.Account;

namespace WebLogBase.Repositories.System.Account
{
    public interface IUserRepository : IEntityBaseWithIdRepository<User> { }

    //public interface IGroupRepository : IEntityBaseRepository<Group> { }

    //public interface IUserGroupRepository : IEntityBaseRepository<UserGroup> { }
}
