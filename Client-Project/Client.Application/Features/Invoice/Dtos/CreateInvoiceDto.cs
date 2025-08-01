﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Client.Application.Features.Invoice.Dtos
{
    public class CreateInvoiceDto
    {
        public string InvoiceNo { get; set; }
        public int CompanyId { get; set; }
        public int SubcontractorId { get; set; }
        public int ProductId { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int Quantity { get; set; }
        public decimal UnitAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal CommissionPercentage { get; set; }
        public decimal CommissionAmount { get; set; }
        public string? Status { get; set; }
        public string PaymentMode { get; set; }
        public int CreatedBy { get; set; }
    }
}
