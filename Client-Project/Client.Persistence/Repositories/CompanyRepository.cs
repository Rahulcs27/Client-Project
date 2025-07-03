using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;
using Client.Application.Interfaces;
using Client.Domain.Models;
using Client.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Client.Persistence.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly AppDbContext _context;
        public CompanyRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<CompanyDto>> GetAllCompaniesAsync()
        {
            return await _context.Companies.FromSqlRaw("sp_sbs_companyMaster_get").ToListAsync();
        }

        public async Task<CompanyDto> GetCompanyByIdAsync(int Id)
        {
            var companies = await _context.Companies.FromSqlRaw("sp_sbs_companyMaster_get {0}", Id).ToListAsync();
            return companies.FirstOrDefault();
        }
    }
}
