using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Client.Domain.Models
{
    public class InvoiceDetails
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int SubcontractorId { get; set; }
        public int ProductId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string Status { get; set; } = "Pending";
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; } = 0;
        public string PaymentMode { get; set; } //cash/UPI
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int IsActive { get; set; } = 1;
        public int IsDeleted { get; set; } = 0;
    }
}
