using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Product.Dtos;
using Client.Application.Features.Product.Queries;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.Product.Handlers
{
    public class GetAllCompanyQueryHandler : IRequestHandler<GetAllCompanyQuery, List<GetAllCompanyDto>>
    {
        private readonly ICompanyRepository _companyRepository;
        public GetAllCompanyQueryHandler(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task<List<GetAllCompanyDto>> Handle(GetAllCompanyQuery request, CancellationToken cancellationToken)
        {
            return await _companyRepository.GetAllCompaniesAsync();
        }
    }
}
