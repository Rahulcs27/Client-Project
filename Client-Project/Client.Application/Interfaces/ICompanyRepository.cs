using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;

namespace Client.Application.Interfaces
{
    public interface ICompanyRepository
    {
        Task<List<GetAllCompanyDto>> GetAllCompaniesAsync();
        Task<GetByIdCompanyDto> GetCompanyByIdAsync(int Id);

    }
}
