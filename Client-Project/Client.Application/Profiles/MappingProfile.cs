using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Client.Application.Features.Product.Dtos;
using Client.Domain.Models;

namespace Client.Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
           CreateMap<GetAllCompanyDto, CompanyMaster>().ReverseMap();
           CreateMap<GetByIdCompanyDto, CompanyMaster>().ReverseMap();
          

        }
    }
}
