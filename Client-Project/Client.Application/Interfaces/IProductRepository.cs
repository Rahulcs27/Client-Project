using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;
using Client.Domain.Models;

namespace Client.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<ProductDto> CreateProductAsync(CreateProductDto dto);
        Task<ProductDto> UpdateProductAsync(UpdateProductDto dto);


        Task<List<ProductDto>> GetAllProductsAsync();
        Task<List<ProductDto>> GetProductsAsync(int? id, string? description);
        Task<DeleteProductResultDto> DeleteProductAsync(int id, int updatedBy);


        //Task<Product> GetProductByIdAsync(int id);

    }
}
