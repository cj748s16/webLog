using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using WebLogBase.Entities;

namespace WebLogBase.Repositories
{
    public interface IEntityBaseWithIdRepository<T> : IEntityBaseRepository<T> where T : class, IEntityBaseWithId, new()
    {
        Task<T> GetSingleByIdAsync(int? id);
    }
}
