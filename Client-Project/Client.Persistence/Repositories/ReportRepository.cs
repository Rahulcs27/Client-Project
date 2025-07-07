using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.PaymentReports.Dtos;
using Client.Application.Interfaces;
using Dapper;

namespace Client.Persistence.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly IDbConnection _db;

        public ReportRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<List<PaidReportDto>> GetPaidReportAsync(int? month, int? year, string? paymentMode)
        {
            var param = new DynamicParameters();
            param.Add("@p_month", month);
            param.Add("@p_year", year);
            param.Add("@p_paymentMode", paymentMode);

            var result = await _db.QueryAsync<PaidReportDto>("sp_sbs_PaidBalancePaymentReport", param, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }

        public async Task<List<UnpaidReportDto>> GetUnpaidReportAsync(int? month, int? year, string? paymentMode)
        {
            var param = new DynamicParameters();
            param.Add("@p_month", month);
            param.Add("@p_year", year);
            param.Add("@p_paymentMode", paymentMode);

            var result = await _db.QueryAsync<UnpaidReportDto>("sp_sbs_unPaidBalancePaymentReport", param, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }

        public async Task<List<ProductWiseReportDto>> GetProductWiseReportAsync(int? month, int? year, string? productName)
        {
            var param = new DynamicParameters();
            param.Add("@p_month", month);
            param.Add("@p_year", year);
            param.Add("@p_productName", productName);

            var result = await _db.QueryAsync<ProductWiseReportDto>("sp_sbs_ProductWisePayment", param, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }

        public async Task<List<SubcontractorWiseReportDto>> GetSubcontractorWiseReportAsync(int? month, int? year, string? subCoName)
        {
            var param = new DynamicParameters();
            param.Add("@p_month", month);
            param.Add("@p_year", year);
            param.Add("@p_subCoName", subCoName);

            var result = await _db.QueryAsync<SubcontractorWiseReportDto>("sp_sbs_MonthlyPaymentSubcontractorWiseTotalPayment", param, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }

}
