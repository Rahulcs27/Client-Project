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
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<GetAllProductDto>> GetAllProductsAsync()
        {
            return await _context.GetAllProducts.FromSqlRaw("sp_sbs_productMaster_get").ToListAsync();
        }
    }
}
