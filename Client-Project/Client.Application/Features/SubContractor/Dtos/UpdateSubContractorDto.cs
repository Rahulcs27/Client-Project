﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.SubContractor.Dtos
{
    public class UpdateSubContractorDto
    {
        public int Id { get; set; }
        public int? CompanyId { get; set; }
        public string? Name { get; set; }
        public int UpdatedBy { get; set; }
    }

}
