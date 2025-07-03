using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Domain.Models;
using MediatR;

namespace Client.Application.Features.Product.Commands
{
    
    public class DeleteProductCommand : IRequest<DeleteProductResultDto>
    {
        public int Id { get; set; }
        public int UpdatedBy { get; set; }

        public DeleteProductCommand(int id, int updatedBy)
        {
            Id = id;
            UpdatedBy = updatedBy;
        }
    }

}
