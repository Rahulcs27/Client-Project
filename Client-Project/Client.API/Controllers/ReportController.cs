using Client.Application.Features.PaymentReports.Dtos;
using Client.Application.Features.PaymentReports.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Client.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReportController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Paid Balance Report
        [HttpGet("paid-report")]
        public async Task<ActionResult<List<PaidReportDto>>> GetPaidReport([FromQuery]string? subcontractorName,[FromQuery] int? companyId, [FromQuery] string? bankName,[FromQuery] string? fromDate,[FromQuery] string? toDate)
        {
            var result = await _mediator.Send(new GetPaidReportQuery(subcontractorName,companyId,bankName,fromDate,toDate));
            return Ok(result);
        }

        // Unpaid Balance Report
        [HttpGet("unpaid-report")]
        public async Task<ActionResult<List<UnpaidReportDto>>> GetUnpaidReport([FromQuery]string? subcontractorName,[FromQuery] int? companyId,[FromQuery] string? fromDate,[FromQuery] string? toDate)
        {
            var result = await _mediator.Send(new GetUnpaidReportQuery(subcontractorName,companyId, fromDate, toDate));
            return Ok(result);
        }

        // Product Wise Report
        [HttpGet("product-wise-report")]
        public async Task<ActionResult<List<ProductWiseReportDto>>> GetProductWiseReport( [FromQuery] string? productName,[FromQuery] string? subcontractorName,[FromQuery] int? companyId, [FromQuery] string? fromDate,[FromQuery] string? toDate)
        {
            var result = await _mediator.Send(new GetProductWiseReportQuery(productName,subcontractorName,companyId,fromDate,toDate));
            return Ok(result);
        }

        // Subcontractor Wise Report
        [HttpGet("subcontractor-wise-report")]
        public async Task<ActionResult<List<SubcontractorWiseReportDto>>> GetSubcontractorWiseReport([FromQuery] string? subcontractorName, [FromQuery] int? companyId, [FromQuery] string? fromDate, [FromQuery] string? toDate)
        {
            var result = await _mediator.Send(new GetSubcontractorWiseReportQuery(subcontractorName, companyId, fromDate, toDate));
            return Ok(result);
        }
        //combined subcontractor report
        [HttpGet("combined-subcontractor-entity")]
        public async Task<IActionResult> GetCombinedReport()
        {
            var result = await _mediator.Send(new GetCombinedSubcontractorReportQuery());
            return Ok(result);
        }
    }
}
