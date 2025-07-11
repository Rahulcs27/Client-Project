using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.Invoice.Dtos
{
    public class InvoiceDetailsDto
    {
        public int R_id { get; set; }
        public int R_companyId { get; set; }
        public string R_companyName { get; set; }
        public int R_subcontractorId { get; set; }
        public string R_subcontractorName { get; set; }
        public int R_productId { get; set; }
        public string R_productDescription { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal R_unitAmount { get; set; }
        public DateTime R_invoiceDate { get; set; }
        public string R_status { get; set; }
        public int R_quantity { get; set; }
        public decimal R_totalAmount { get; set; }
        public string R_paymentMode { get; set; }
    }

}
