using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Company.Commands;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.Company.Handlers
{
    public class DeleteCompanyCommandHandler : IRequestHandler<DeleteCompanyCommand, string>
    {
        private readonly ICompanyRepository _repo;

        public DeleteCompanyCommandHandler(ICompanyRepository repo)
        {
            _repo = repo;
        }

        public async Task<string> Handle(DeleteCompanyCommand request, CancellationToken cancellationToken)
        {
            return await _repo.DeleteCompanyAsync(request.Id);
        }
    }

}
