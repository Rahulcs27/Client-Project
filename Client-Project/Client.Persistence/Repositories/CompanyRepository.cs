using System;
using System.Collections.Generic;
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
        public async Task<List<CompanyMaster>> GetAllCompaniesAsync()
        {
            return await _context.Companies.FromSqlRaw("").ToListAsync();
        }

        public Task<CompanyMaster> GetCompanyByIdAsync(int Id)
        {
            return _context.Companies.FromSqlRaw("", Id).FirstOrDefaultAsync();
        }
    }
}
