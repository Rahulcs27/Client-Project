using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Invoice.Dtos;

namespace Client.Application.Interfaces
{
    public interface IInvoiceRepository
    {
        Task<InvoiceDetailsDto> CreateInvoiceAsync(CreateInvoiceDto dto);
        Task<InvoiceDetailsDto> UpdateInvoiceAsync(UpdateInvoiceDto dto);
        Task<string> DeleteInvoiceAsync(int id, int updatedBy);


        Task<List<InvoiceDetailsDto>> GetInvoicesAsync(int? id = null);
    }

}
