using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Client.Application.Features.Company.Dtos;
using Client.Application.Features.Product.Dtos;
using Client.Domain.Models;

namespace Client.Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateCompanyDto, CompanyMaster>().ReverseMap();
            CreateMap<UpdateCompanyDto, CompanyMaster>().ReverseMap();
            CreateMap<CompanyDto, CompanyMaster>().ReverseMap();
           CreateMap<ProductDto,Product>().ReverseMap();
            CreateMap<CreateProductDto, Product>().ReverseMap();
            CreateMap<UpdateProductDto, Product>().ReverseMap();


        }
    }
}
