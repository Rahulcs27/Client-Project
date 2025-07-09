using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.User.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public int RoleMasterId { get; set; }
        public int CompanyId { get; set; }
        public string Username { get; set; }
    }

}
