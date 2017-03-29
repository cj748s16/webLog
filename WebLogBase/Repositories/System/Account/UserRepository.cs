using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebLogBase.Repositories.System.Account
{
    public class UserRepository : EntityBaseWithIdRepository<User>, IUserRepository
    {
        public UserRepository(WebLogContext context) : base(context)
        {
        }

        public override void Add(User entity)
        {
            entity.Passwdexpr = DateTime.Now.AddYears(1);
            entity.Salt = new byte[] { 0 };
            entity.Password = new byte[] { 0 };

            base.Add(entity);
        }
    }
}
