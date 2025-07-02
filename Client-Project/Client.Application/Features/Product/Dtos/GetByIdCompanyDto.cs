using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.Product.Dtos
{
    public class GetByIdCompanyDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Addresss { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public int IsActive { get; set; }
    }
}
