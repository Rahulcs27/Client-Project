using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Invoice.Commands;
using Client.Application.Features.Invoice.Dtos;
using Client.Application.Interfaces;
using Dapper;

namespace Client.Persistence.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly IDbConnection _db;

        public InvoiceRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<List<InvoiceDetailsDto>> GetInvoicesAsync(int? id = null)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@P_id", id);

            var result = await _db.QueryAsync<InvoiceDetailsDto>(
                "sp_sbs_invoiceDetails_get",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }
        public async Task<InvoiceDetailsDto> CreateInvoiceAsync(CreateInvoiceDto dto)
        {
            var insertParams = new DynamicParameters();
            insertParams.Add("@P_companyId", dto.CompanyId);
            insertParams.Add("@P_subcontractorId", dto.SubcontractorId);
            insertParams.Add("@P_productId", dto.ProductId);
            insertParams.Add("@P_invoiceDate", dto.InvoiceDate);
            insertParams.Add("@P_quantity", dto.Quantity);
            insertParams.Add("@P_totalAmount", dto.TotalAmount);
            insertParams.Add("@P_paymentMode", dto.PaymentMode);
            insertParams.Add("@P_createdBy", dto.CreatedBy);

            var insertResult = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_invoiceDetails_insert",
                insertParams,
                commandType: CommandType.StoredProcedure
            );

            if (insertResult == null || insertResult.R_Status != "Success")
            {
                throw new Exception($"Insert failed: {insertResult?.R_ErrorMessage ?? "Unknown error"}");
            }

            int insertedId = insertResult.R_InsertedID;

            var getParams = new DynamicParameters();
            getParams.Add("@P_id", insertedId);

            var invoiceDetails = await _db.QueryFirstOrDefaultAsync<InvoiceDetailsDto>(
                "sp_sbs_invoiceDetails_get",
                getParams,
                commandType: CommandType.StoredProcedure
            );

            return invoiceDetails ?? throw new Exception("Inserted invoice not found.");
        }
        public async Task<InvoiceDetailsDto> UpdateInvoiceAsync(UpdateInvoiceDto dto)
        {
            var updateParams = new DynamicParameters();
            updateParams.Add("@P_id", dto.Id);
            updateParams.Add("@P_productId", dto.ProductId);
            updateParams.Add("@P_invoiceDate", dto.InvoiceDate);
            updateParams.Add("@P_quantity", dto.Quantity);
            updateParams.Add("@P_totalAmount", dto.TotalAmount);
            updateParams.Add("@P_paymentMode", dto.PaymentMode);
            updateParams.Add("@P_status", dto.Status);
            updateParams.Add("@P_updatedBy", dto.UpdatedBy);

            var updateResult = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_invoiceDetails_update",
                updateParams,
                commandType: CommandType.StoredProcedure
            );

            if (updateResult == null || updateResult.R_Status != "Success")
            {
                throw new Exception($"Update failed: {updateResult?.R_ErrorMessage ?? "Unknown error"}");
            }

            int updatedId = updateResult.R_UpdatedID;

            var getParams = new DynamicParameters();
            getParams.Add("@P_id", updatedId);

            var updatedInvoice = await _db.QueryFirstOrDefaultAsync<InvoiceDetailsDto>(
                "sp_sbs_invoiceDetails_get",
                getParams,
                commandType: CommandType.StoredProcedure
            );

            return updatedInvoice ?? throw new Exception("Updated invoice not found.");
        }

        //public async Task<InvoiceDetailsDto> DeleteInvoiceAsync(int id, int updatedBy)
        //{
        //    var deleteParams = new DynamicParameters();
        //    deleteParams.Add("@P_id", id);
        //    deleteParams.Add("@P_updatedBy", updatedBy);

        //    var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
        //        "sp_sbs_invoiceDetails_delete",
        //        deleteParams,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    if (result == null || result.R_Status != "Success")
        //        throw new Exception($"Delete failed: {result?.R_ErrorMessage ?? "Unknown error"}");

        //    // Bypass SP and fetch deleted invoice directly
        //    var sql = @"SELECT 
        //            id AS R_id,
        //            companyId AS R_companyId,
        //            subcontractorId AS R_subcontractorId,
        //            productId AS R_productId,
        //            invoiceDate AS R_invoiceDate,
        //            status AS R_status,
        //            quantity AS R_quantity,
        //            totalAmount AS R_totalAmount,
        //            paymentMode AS R_paymentMode
        //        FROM sbs_invoiceDetails
        //        WHERE id = @Id";

        //    return await _db.QueryFirstOrDefaultAsync<InvoiceDetailsDto>(sql, new { Id = id })
        //           ?? throw new Exception("Invoice not found after deletion.");
        //}

        public async Task<string> DeleteInvoiceAsync(int id, int updatedBy)
        {
            var deleteParams = new DynamicParameters();
            deleteParams.Add("@P_id", id);
            deleteParams.Add("@P_updatedBy", updatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_invoiceDetails_delete",
                deleteParams,
                commandType: CommandType.StoredProcedure
            );

            if (result == null || result.R_Status != "Success")
                throw new Exception($"Delete failed: {result?.R_ErrorMessage ?? "Unknown error"}");

            return "Success";
        }


    }

}
