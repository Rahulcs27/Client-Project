using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.ComponentModel.Design;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.Company.Dtos;
using Client.Application.Features.Product.Dtos;
using Client.Application.Interfaces;
using Client.Domain.Models;
using Client.Persistence.Context;
using Dapper;
using Microsoft.EntityFrameworkCore;

namespace Client.Persistence.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly AppDbContext _context;
        private readonly IDbConnection _db;
        public CompanyRepository(AppDbContext context, IDbConnection db)
        {
            _context = context;
            _db = db;
        }

        public async Task<List<CompanyDto>> GetCompaniesAsync(int? companyId, string? search)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_searchName", search);
            parameters.Add("@p_CompanyID", companyId);

            var result = await _db.QueryAsync<CompanyDto>(
                "sp_sbs_companyMaster_get",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }



        public async Task<List<CompanyDto>> CreateCompanyAsync(CreateCompanyDto companyDto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_name", companyDto.Name);
            parameters.Add("@p_address", companyDto.Address);
            parameters.Add("@p_phone", companyDto.Phone);
            parameters.Add("@p_email", companyDto.Email);
            parameters.Add("@p_createdBy", companyDto.CreatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_companyMaster_insert",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            if (result?.R_Status == "SUCCESS" && result?.R_InsertedID != null)
            {
                //return new CompanyDto
                //{
                //    Id = result.inserted_id.Value,
                //    Name = companyDto.Name,
                //    Address = companyDto.Address,
                //    Phone = companyDto.Phone,
                //    Email = companyDto.Email,

                //};
                return await GetCompaniesAsync(null, null);

            }

            throw new Exception("Company insert failed");
        }
        public async Task<List<CompanyDto>> UpdateCompanyAsync(UpdateCompanyDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", dto.Id);
            parameters.Add("@p_name", dto.Name);
            parameters.Add("@p_address", dto.Address);
            parameters.Add("@p_phone", dto.Phone);
            parameters.Add("@p_email", dto.Email);
            parameters.Add("@p_updatedBy", dto.UpdatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<string>(
                "sp_sbs_companyMaster_update",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result != "SUCCESS")
                throw new Exception("Company update failed: " + result);

            var updatedCompany = await _db.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT TOP 1 * FROM sbs_companyMaster WHERE id = @Id AND isDeleted = 0",
                new { Id = dto.Id }
            );

            if (updatedCompany == null)
                throw new Exception("Updated company not found.");

            //return new CompanyDto
            //{
            //    Id = updatedCompany.Id,
            //    Name = updatedCompany.Name,
            //    Address = updatedCompany.Address,
            //    Phone = updatedCompany.Phone,
            //    Email = updatedCompany.Email
            //};
            return await GetCompaniesAsync(null, null);
        }
        public async Task<List<CompanyDto>> DeleteCompanyAsync(int id,int updatedBy)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);
            parameters.Add("@p_updatedBy", updatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_companyMaster_delete",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            if (result == null || result.R_Status != "SUCCESS")
                throw new Exception($"Update failed: {result?.R_ErrorMessage ?? "Unknown error"}");

            return await GetCompaniesAsync(null, null);

        }
    }
}
