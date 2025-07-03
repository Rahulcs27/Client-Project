using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;
using Client.Application.Interfaces;
using Client.Domain.Models;
using Client.Persistence.Context;
using Dapper;
using Microsoft.EntityFrameworkCore;

namespace Client.Persistence.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;
        private readonly IDbConnection _db;

        public ProductRepository(AppDbContext context,IDbConnection dbConnection)
        {
            _context = context;
            _db = dbConnection;

        }

        public async Task<List<ProductDto>> GetAllProductsAsync()
        {
            return await _context.GetAllProducts.FromSqlRaw("sp_sbs_productMaster_get").ToListAsync();
        }
        public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@P_description", dto.Description);
            parameters.Add("@P_unitPrice", dto.UnitPrice);
            parameters.Add("@P_createdBy", dto.CreatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<InsertProductResult>(
                "sp_sbs_productMaster_insert",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result.R_Status == "Success" && result.R_InsertedID.HasValue)
            {
                return new ProductDto
                {
                    R_id = result.R_InsertedID.Value,
                    R_description = dto.Description,
                    R_unitPrice = dto.UnitPrice,
                   
                };
            }

            throw new Exception($"Insert Failed: {result.R_ErrorMessage} (ErrorCode: {result.R_ErrorNumber})");
        }
        //public async Task<ProductDto> UpdateProductAsync(UpdateProductDto dto)
        //{
        //    var parameters = new DynamicParameters();
        //    parameters.Add("@P_id", dto.Id);
        //    parameters.Add("@P_description", dto.Description);
        //    parameters.Add("@P_unitPrice", dto.UnitPrice);
        //    parameters.Add("@P_updatedBy", dto.UpdatedBy);

        //    var result = await _db.QueryFirstOrDefaultAsync<UpdateProductResult>(
        //        "sp_sbs_productMaster_update",
        //        parameters,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    if (result.R_Status == "Success")
        //    {
        //        // Fetch updated product from DB
        //        var updatedProduct = await _db.QueryFirstOrDefaultAsync<ProductDto>(
        //            "SELECT * FROM sbs_productMaster WHERE id = @id AND isDeleted = 0",
        //            new { id = dto.Id }
        //        );

        //        return updatedProduct ?? throw new Exception("Updated product not found.");
        //    }

        //    throw new Exception($"Update Failed: {result.R_ErrorMessage} (Code: {result.R_ErrorNumber})");
        //}
        public async Task<ProductDto> UpdateProductAsync(UpdateProductDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@P_id", dto.Id);
            parameters.Add("@P_description", dto.Description);
            parameters.Add("@P_unitPrice", dto.UnitPrice);
            parameters.Add("@P_updatedBy", dto.UpdatedBy);

            // Call the SP to perform update
            var result = await _db.QueryFirstOrDefaultAsync<string>(
                "sp_sbs_productMaster_update",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result == "Success")
            {
                // Fetch the updated product manually
                var product = await _db.QueryFirstOrDefaultAsync<Product>(
                    @"SELECT id, description, unitPrice 
              FROM sbs_productMaster 
              WHERE id = @Id AND isDeleted = 0",
                    new { Id = dto.Id }
                );

                if (product == null)
                    throw new Exception("Updated product not found");

                return new ProductDto
                {
                    R_id = product.Id,
                    R_description = product.Description,
                    R_unitPrice = product.UnitPrice
                };
            }

            throw new Exception("Product update failed");
        }
        public async Task<DeleteProductResultDto> DeleteProductAsync(int id, int updatedBy)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@P_id", id);
            parameters.Add("@P_updatedBy", updatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<DeleteProductResultDto>(
                "sp_sbs_productMaster_delete",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        public async Task<List<ProductDto>> GetProductsAsync(int? id, string? description)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@P_id", id);
            parameters.Add("@P_description", description);

            var result = await _db.QueryAsync<ProductDto>(
                "sp_sbs_productMaster_get",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }

    }
}
