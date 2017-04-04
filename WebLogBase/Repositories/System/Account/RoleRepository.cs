using System;
using System.Collections.Generic;
using System.Text;
using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;

namespace WebLogBase.Repositories.System.Account
{
    public class RoleRepository : EntityBaseWithIdRepository<Role>, IRoleRepository
    {
        public RoleRepository(WebLogContext context) : base(context)
        {
        }

        public override void Add(Role entity)
        {
            throw new Exception($"You can't add new {nameof(Role)}");
        }

        public override void Modify(Role entity)
        {
            throw new Exception($"You can't modify {nameof(Role)}");
        }

        public override void Delete(Role entity)
        {
            throw new Exception($"You can't delete {nameof(Role)}");
        }
    }
}
