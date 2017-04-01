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

        public virtual IQueryable<TEntity> FromSql<TEntity>(string sql)
            where TEntity : class, IEntityBase, new()
        {
            return context.Set<TEntity>().FromSql(sql);
        }

        protected string ConvertToSql(Expression<Func<T, bool>> predicate)
        {
            // visit the expression and convertes the predicate to a SQL part
            var expr = new Visitor().Visit(predicate) as ConstantExpression;
            return (string)expr.Value;
        }

        protected string ReplaceAndConvertToSql<TEntity>(Expression<Func<T, bool>> origPredicate, Expression<Func<TEntity, object>> newPredicate)
            where TEntity : class, IEntityBase, new()
        {
            // replace the member access of the original predicate to the new predicate, then converts it to a SQL part
            var replacedPredicate = ReplaceParameter(origPredicate, newPredicate);
            var expr = new Visitor().Visit(replacedPredicate) as ConstantExpression;
            return (string)expr.Value;
        }

        private Expression ReplaceParameter<TEntity>(Expression<Func<T, bool>> predicate, Expression<Func<TEntity, object>> newPredicate)
            where TEntity : class, IEntityBase, new()
        {
            // check the expression left and right side, for a member access expression, and replace it to the new one
            var binary = predicate.Body as BinaryExpression;

            var left = binary.Left;
            if (binary.Left is MemberExpression)
            {
                left = ReplaceMemberExpression((MemberExpression)binary.Left, newPredicate);
            }

            var right = binary.Right;
            if (binary.Right is MemberExpression)
            {
                right = ReplaceMemberExpression((MemberExpression)binary.Right, newPredicate);
            }

            return Expression.Equal(left, right);
        }

        private Expression ReplaceMemberExpression<TEntity>(MemberExpression node, Expression<Func<TEntity, object>> newPredicate)
            where TEntity : class, IEntityBase, new()
        {
            if (node.Expression is ParameterExpression param)
            {
                // extracts the member access expression from the new predicate, and returning it
                if (newPredicate.Body is UnaryExpression unaryExpr)
                {
                    return unaryExpr.Operand;
                }
            }

            return node;
        }

        class Visitor : ExpressionVisitor
        {
            protected override Expression VisitLambda<T1>(Expression<T1> node)
            {
                var body = node.Body;
                if (body is BinaryExpression)
                {
                    var binary = body as BinaryExpression;
                    if (binary != null)
                    {
                        return VisitBinary(binary);
                    }
                }
                return base.VisitLambda(node);
            }

            protected override Expression VisitBinary(BinaryExpression node)
            {
                var memberLeft = node.Left as MemberExpression;
                var memberRight = node.Right as MemberExpression;
                if (memberLeft != null && memberRight != null)
                {
                    var left = VisitMember(memberLeft);
                    var leftValue = ((ConstantExpression)left).Value;
                    var right = VisitMember(memberRight);
                    var rightValue = ((ConstantExpression)right).Value;

                    return Expression.Constant($"{leftValue} = {(rightValue is string ? $"'{rightValue}'" : rightValue)}");
                }
                return base.VisitBinary(node);
            }

            protected override Expression VisitMember(MemberExpression node)
            {
                var expression = Visit(node.Expression);

                if (expression is ConstantExpression)
                {
                    var f = Expression.Lambda(node).Compile();
                    return Expression.Constant(f.DynamicInvoke());
                }

                if (expression is ParameterExpression)
                {
                    var member = node.Member.Name;
                    var name = ((ParameterExpression)expression).Name;
                    return Expression.Constant(!string.IsNullOrWhiteSpace(name) ? $"{name}.{member}" : member);
                }

                return base.VisitMember(node);
            }
        }
    }
}
