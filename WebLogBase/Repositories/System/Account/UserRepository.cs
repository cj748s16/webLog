using WebLogBase.Entities.System.Account;
using WebLogBase.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebLogBase.Infrastructure.Core;

namespace WebLogBase.Repositories.System.Account
{
    public class UserRepository : EntityBaseWithIdRepository<User>, IUserRepository
    {
        public UserRepository(WebLogContext context) : base(context)
        {
        }

        public override void Add(User entity)
        {
            EncryptPassword(entity);

            base.Add(entity);
        }

        public async Task AddAsync(User entity)
        {
            await EncryptPasswordAsync(entity);

            base.Add(entity);
        }

        public override void Modify(User entity)
        {
            EncryptPassword(entity);

            base.Modify(entity);
        }

        public async Task ModifyAsync(User entity)
        {
            await EncryptPasswordAsync(entity);

            base.Modify(entity);
        }

        private static void EncryptPassword(User entity)
        {
            entity.Salt = CryptoService.CreateSalt();
            var newPassword = CreatePassword(entity.Userid, entity.Salt, entity.PasswordStr);
            if (!newPassword.SequenceEqual(entity.Password))
            {
                entity.Password = newPassword;
                entity.Passwdexpr = DateTime.Now.AddYears(1);
            }
        }

        private static async Task EncryptPasswordAsync(User entity)
        {
            entity.Salt = CryptoService.CreateSalt();
            var newPassword = await CreatePasswordAsync(entity.Userid, entity.Salt, entity.PasswordStr);
            if (entity.Password == null || !newPassword.SequenceEqual(entity.Password))
            {
                entity.Password = newPassword;
                entity.Passwdexpr = DateTime.Now.AddYears(1);
            }
        }

        private static string PreparePassword(string userId, byte[] salt, string password)
        {
            return $"webLog.{Convert.ToBase64String(salt)}.{userId}.{password}";
        }

        internal static byte[] CreatePassword(string userId, byte[] salt, string password)
        {
            var passwd = PreparePassword(userId, salt, password);
            return CryptoService.ComputeMD5Hash(CryptoService.Encrypt(passwd));
        }

        internal static async Task<byte[]> CreatePasswordAsync(string userId, byte[] salt, string password)
        {
            var passwd = PreparePassword(userId, salt, password);
            return CryptoService.ComputeMD5Hash(await CryptoService.EncryptAsync(passwd));
        }
    }
}
