using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Company.Dtos;
using Client.Application.Features.Product.Dtos;
using Client.Domain.Models;

namespace Client.Application.Interfaces
{
    public interface ICompanyRepository
    {
        Task<CompanyDto> CreateCompanyAsync(CreateCompanyDto companyDto);
        Task<CompanyDto> UpdateCompanyAsync(UpdateCompanyDto dto);
        Task<string> DeleteCompanyAsync(int Id);


        Task<List<CompanyDto>> GetAllCompaniesAsync();
        Task<CompanyDto> GetCompanyByIdAsync(int Id);


    }
}
