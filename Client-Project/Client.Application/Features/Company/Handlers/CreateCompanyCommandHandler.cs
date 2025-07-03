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
    public class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, CompanyDto>
    {
        public ICompanyRepository _repo;
        public IMapper _mapper;
        public CreateCompanyCommandHandler(ICompanyRepository repo ,IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }
        public async Task<CompanyDto> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
        {
            var result = await _repo.CreateCompanyAsync(request.Company);
            return _mapper.Map<CompanyDto>(result);
        }
    }
}
