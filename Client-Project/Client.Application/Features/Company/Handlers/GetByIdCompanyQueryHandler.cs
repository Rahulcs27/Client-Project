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
    public class GetByIdCompanyQueryHandler : IRequestHandler<GetByIdCompanyQuery, CompanyDto>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        public GetByIdCompanyQueryHandler(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }
        public async Task<CompanyDto> Handle(GetByIdCompanyQuery request, CancellationToken cancellationToken)
        {
            var result = await _companyRepository.GetCompanyByIdAsync(request.Id);
            return result;
        }
    }
}
