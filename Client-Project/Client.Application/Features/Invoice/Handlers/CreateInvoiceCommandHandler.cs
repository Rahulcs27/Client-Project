using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Client.Application.Features.Invoice.Commands;
using Client.Application.Features.Invoice.Dtos;
using Client.Application.Interfaces;
using MediatR;

namespace Client.Application.Features.Invoice.Handlers
{
    public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, InvoiceDetailsDto>
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IMapper _mapper;
        public CreateInvoiceCommandHandler(IInvoiceRepository invoiceRepository, IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }
        public async Task<InvoiceDetailsDto> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var result = await _invoiceRepository.CreateInvoiceAsync(request.Invoice);
            return _mapper.Map<InvoiceDetailsDto>(result);
        }
    }
}
