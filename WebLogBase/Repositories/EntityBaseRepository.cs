using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WebLogBase.Entities;
using WebLogBase.Infrastructure;

namespace WebLogBase.Repositories
{
    public class EntityBaseRepository<T> : IEntityBaseRepository<T>
        where T : class, IEntityBase, new()
    {
        private readonly WebLogContext context;

        public EntityBaseRepository(WebLogContext context)
        {
            this.context = context;
        }

        public virtual IQueryable<T> AsQueryable()
        {
            return context.Set<T>().AsQueryable();
        }

        public virtual IQueryable<T> AsQueryable(params Expression<Func<T, object>>[] includeProperties)
        {
            var query = context.Set<T>().AsQueryable();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query;
        }

        public virtual async Task<T> GetSingleAsync(Expression<Func<T, bool>> predicate)
        {
            return await context.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<int> CountAsync()
        {
            return await context.Set<T>().CountAsync();
        }

        public virtual void Add(T entity)
        {
            if (entity is IEntityWithAdding)
            {
                var ent = (IEntityWithAdding)entity;
                ent.Adddate = DateTime.Now;
            }

            if (entity is IEntityWithDelstat)
            {
                var ent = (IEntityWithDelstat)entity;
                ent.Delstat = ent.Delstat ?? 0;
            }

            context.Set<T>().Add(entity);
        }

        public virtual void Modify(T entity)
        {
            var dbEntityEntry = context.Entry<T>(entity);
            dbEntityEntry.State = EntityState.Modified;
        }

        public virtual void Delete(T entity)
        {
            var dbEntityEntry = context.Entry<T>(entity);
            dbEntityEntry.State = EntityState.Deleted;
        }

        public virtual int Commit()
        {
            return context.SaveChanges();
        }

        public virtual async Task<int> CommitAsync()
        {
            return await context.SaveChangesAsync();
        }

        public virtual IQueryable<T> FromSql(string sql)
        {
            return context.Set<T>().FromSql(sql);
        }
    }
}
