﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Client.Application.Features.Product.Commands;
using Client.Application.Features.Product.Dtos;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.Product.Handlers
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
    {
        private readonly IProductRepository _repo;
        private readonly IMapper _mapper;

        public CreateProductCommandHandler(IProductRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _repo.CreateProductAsync(request.Product);
            return _mapper.Map<ProductDto>(product);
        }
    }

}
