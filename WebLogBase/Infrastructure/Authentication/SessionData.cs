using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WebLogBase.Infrastructure.Core;

namespace WebLogBase.Infrastructure.Authentication
{
    public class SessionData
    {
        public byte[] Ipa { get; }
        [JsonIgnore]
        public string Cn { get; }
        public string Prime { get; }
        public string Timestamp { get; }
        public string Sid { get; }
        [JsonIgnore]
        public MembershipContext Context { get; internal set; }
        [JsonIgnore]
        public AuthenticationTicket Ticket { get; internal set; }
        public string Userid
        {
            get
            {
                return Context?.Userid;
            }
        }

        public SessionData(byte[] ipa, string cn, string prime, long timestamp, string sid)
        {
            Ipa = ipa;
            Cn = cn;
            Prime = prime;
            Sid = sid;
            Timestamp = timestamp.ToString();
        }
    }
}
