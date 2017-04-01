using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WebLogBase.Entities;

namespace WebLogBase.Repositories
{
    public interface IEntityBaseRepository<T> where T : class, IEntityBase, new()
    {
        IQueryable<T> AsQueryable();
        IQueryable<T> AsQueryable(params Expression<Func<T, object>>[] includeProperties);
        Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate);
        Task<int> CountAsync();
        void Add(T entity);
        void Modify(T entity);
        void Delete(T entity);
        int Commit();
        Task<int> CommitAsync();

        IQueryable<TEntity> FromSql<TEntity>(string sql) where TEntity : class, IEntityBase, new();
    }
}
