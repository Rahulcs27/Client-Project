using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.PaymentReports.Dtos;

namespace Client.Application.Interfaces
{
    public interface IReportRepository
    {
        Task<List<PaidReportDto>> GetPaidReportAsync(int? month, int? year, string? paymentMode);
        Task<List<UnpaidReportDto>> GetUnpaidReportAsync(int? month, int? year, string? paymentMode);
        Task<List<ProductWiseReportDto>> GetProductWiseReportAsync(int? month, int? year, string? productName);
        Task<List<SubcontractorWiseReportDto>> GetSubcontractorWiseReportAsync(int? month, int? year, string? subCoName);
    }

}
