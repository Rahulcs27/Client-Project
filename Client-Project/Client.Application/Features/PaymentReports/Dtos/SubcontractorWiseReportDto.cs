using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.PaymentReports.Dtos
{
    public class SubcontractorWiseReportDto
    {
        public string SubCoName { get; set; }
        public int NoOfInvoice { get; set; }
        public string MonthYear { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal CashAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal UnPaidAmount { get; set; }
    }

}
