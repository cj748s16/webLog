using System;
using System.Collections.Generic;
using System.Text;
using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;

namespace WebLogBase.Repositories.System.Account
{
    public class GroupRepository : EntityBaseWithIdRepository<Group>, IGroupRepository
    {
        public GroupRepository(WebLogContext context) : base(context)
        {
        }
    }
}
