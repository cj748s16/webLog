using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace WebLogBase.Infrastructure.Core
{
    public static class CryptoService
    {
        internal const string prime = "7368152973681529";
        private static byte[] key = Encoding.UTF8.GetBytes(prime);
        private static byte[] iv = Encoding.UTF8.GetBytes(prime);

        public static byte[] Encrypt(string plainText)
        {
            var plainBytes = Encoding.UTF8.GetBytes(plainText);
            var encrypted = Encrypt(plainBytes, key, iv);
            return encrypted;
        }

        private static byte[] Encrypt(byte[] plainBytes, byte[] key, byte[] iv)
        {
            using (var aesAlg = Aes.Create())
            {
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.BlockSize = 128;

                aesAlg.Key = key;
                aesAlg.IV = iv;

                var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                using (var ms = new MemoryStream())
                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                {
                    cs.Write(plainBytes, 0, plainBytes.Length);
                    cs.FlushFinalBlock();
                    return ms.ToArray();
                }
            }
        }

        public static async Task<byte[]> EncryptAsync(string plainText)
        {
            var plainBytes = Encoding.UTF8.GetBytes(plainText);
            var encrypted = await EncryptAsync(plainBytes, key, iv);
            return encrypted;
        }

        private static async Task<byte[]> EncryptAsync(byte[] plainBytes, byte[] key, byte[] iv)
        {
            using (var aesAlg = Aes.Create())
            {
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.BlockSize = 128;

                aesAlg.Key = key;
                aesAlg.IV = iv;

                var encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                using (var ms = new MemoryStream())
                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                {
                    await cs.WriteAsync(plainBytes, 0, plainBytes.Length);
                    cs.FlushFinalBlock();
                    return ms.ToArray();
                }
            }
        }

        public static string Decrypt(byte[] cipherBytes)
        {
            var decrypted = Decrypt(cipherBytes, key, iv);
            var plainText = Encoding.UTF8.GetString(decrypted);
            return plainText;
        }

        private static byte[] Decrypt(byte[] cipherBytes, byte[] key, byte[] iv)
        {
            using (var aesAlg = Aes.Create())
            {
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.BlockSize = 128;

                aesAlg.Key = key;
                aesAlg.IV = iv;

                var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using (var ms = new MemoryStream())
                using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Write))
                {
                    cs.Write(cipherBytes, 0, cipherBytes.Length);
                    cs.FlushFinalBlock();
                    return ms.ToArray();
                }
            }
        }

        public static async Task<string> DecryptAsync(byte[] cipherBytes)
        {
            var decrypted = await DecryptAsync(cipherBytes, key, iv);
            var plainText = Encoding.UTF8.GetString(decrypted);
            return plainText;
        }

        private static async Task<byte[]> DecryptAsync(byte[] cipherBytes, byte[] key, byte[] iv)
        {
            using (var aesAlg = Aes.Create())
            {
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.BlockSize = 128;

                aesAlg.Key = key;
                aesAlg.IV = iv;

                var decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using (var ms = new MemoryStream())
                using (var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Write))
                {
                    await cs.WriteAsync(cipherBytes, 0, cipherBytes.Length);
                    cs.FlushFinalBlock();
                    return ms.ToArray();
                }
            }
        }

        public static byte[] ComputeMD5Hash(byte[] buffer)
        {
            using (var md5 = MD5.Create())
            {
                return md5.ComputeHash(buffer);
            }
        }

        public static byte[] ComputeSHA512Hash(byte[] buffer)
        {
            using (var sha512 = SHA512.Create())
            {
                return sha512.ComputeHash(buffer);
            }
        }

        public static byte[] CreateSalt()
        {
            var data = new byte[0x10];
            using (var generator = RandomNumberGenerator.Create())
            {
                generator.GetBytes(data);
            }
            return data;
        }
    }
}
