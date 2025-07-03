using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Client.Application.Features.Product.Dtos;
using Client.Application.Features.Product.Queries;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.Product.Handlers
{
    public class GetAllProductQueryHandler : IRequestHandler<GetAllProductQuery, List<GetAllProductDto>>
    {
        private readonly IProductRepository _productRepository;
        public GetAllProductQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<List<GetAllProductDto>> Handle(GetAllProductQuery request, CancellationToken cancellationToken)
        {
            var result = await _productRepository.GetAllProductsAsync();
            return result;
        }
    }
}
