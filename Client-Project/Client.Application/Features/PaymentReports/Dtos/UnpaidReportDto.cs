using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.PaymentReports.Dtos
{

    public class UnpaidReportDto
    {
        public string PaymentMode { get; set; }
        public int NoOfInvoice { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal UnPaidAmount { get; set; }
    }

}
