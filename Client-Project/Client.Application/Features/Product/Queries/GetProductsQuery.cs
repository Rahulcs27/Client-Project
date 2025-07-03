using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;
using MediatR;

namespace Client.Application.Features.Product.Queries
{

    public class GetProductsQuery : IRequest<List<ProductDto>>
    {
        public int? Id { get; }
        public string Description { get; }

        public GetProductsQuery(int? id = null, string description = null)
        {
            Id = id;
            Description = description;
        }
    }

}
