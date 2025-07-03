using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.Product.Dtos
{
    public class GetAllProductDto
    {
        public int R_id { get; set; }
        public string R_description { get; set; }
        public decimal R_unitPrice { get; set; }

    }
}
