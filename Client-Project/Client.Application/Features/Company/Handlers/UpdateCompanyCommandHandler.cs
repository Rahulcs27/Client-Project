using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Client.Application.Features.Company.Commands;
using Client.Application.Features.Product.Dtos;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.Company.Handlers
{

    public class UpdateCompanyCommandHandler : IRequestHandler<UpdateCompanyCommand, CompanyDto>
    {
        private readonly ICompanyRepository _repo;
        private readonly IMapper _mapper;

        public UpdateCompanyCommandHandler(ICompanyRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CompanyDto> Handle(UpdateCompanyCommand request, CancellationToken cancellationToken)
        {
            var updatedEntity = await _repo.UpdateCompanyAsync(request.Company);
            return _mapper.Map<CompanyDto>(updatedEntity);
        }
    }

}
