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
    public class GetAllCompanyQueryHandler : IRequestHandler<GetAllCompanyQuery, List<GetAllCompanyDto>>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        public GetAllCompanyQueryHandler(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task<List<GetAllCompanyDto>> Handle(GetAllCompanyQuery request, CancellationToken cancellationToken)
        {
            var result =  await _companyRepository.GetAllCompaniesAsync();
            var output = _mapper.Map<List<GetAllCompanyDto>>(result);
            return output;

        }
    }
}
