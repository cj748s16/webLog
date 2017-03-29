using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities;
using WebLogBase.Infrastructure;

namespace WebLogBase.Repositories
{
    public class EntityBaseWithIdRepository<T> : EntityBaseRepository<T>, IEntityBaseWithIdRepository<T>
        where T : class, IEntityBaseWithId, new()
    {
        public EntityBaseWithIdRepository(WebLogContext context) : base(context)
        {
        }

        public virtual async Task<T> GetSingleByIdAsync(int? id)
        {
            if (!id.HasValue)
            {
                return null;
            }

            return await GetSingleAsync(e => e.Id == id);
        }
    }
}
