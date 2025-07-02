using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;
using Client.Domain.Models;

namespace Client.Application.Interfaces
{
    public interface ICompanyRepository
    {
        Task<List<CompanyMaster>> GetAllCompaniesAsync();
        Task<CompanyMaster> GetCompanyByIdAsync(int Id);

    }
}
