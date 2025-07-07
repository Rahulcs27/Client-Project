using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.SubContractor.Dtos;
using Client.Application.Interfaces;
using Dapper;

namespace Client.Persistence.Repositories
{

    public class SubContractorRepository : ISubContractorRepository
    {
        private readonly IDbConnection _db;

        public SubContractorRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<List<SubContractorDto>> GetSubContractorsAsync(int? id, string? search)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);
            parameters.Add("@p_search", search);

            var result = await _db.QueryAsync<SubContractorDto>(
                "sp_sbs_subContractor_get",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }
        public async Task<List<SubContractorDto>> CreateSubContractorAsync(CreateSubContractorDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_companyId", dto.CompanyId);
            parameters.Add("@p_name", dto.Name);
            parameters.Add("@p_createdBy", dto.CreatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_subContractor_insert",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result?.Status == "SUCCESS" && result?.InsertedID != null)
            {
                return await GetSubContractorsAsync(null, null);
            }

            throw new Exception($"Insert Failed: {result?.ErrorMessage ?? "Unknown error"}");
        }
        public async Task<List<SubContractorDto>> UpdateSubContractorAsync(UpdateSubContractorDto dto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", dto.Id);
            parameters.Add("@p_companyId", dto.CompanyId);
            parameters.Add("@p_name", dto.Name);
            parameters.Add("@p_updatedBy", dto.UpdatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<string>(
                "sp_sbs_subContractor_update",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result == "SUCCESS")
            {
                return await GetSubContractorsAsync(null, null);
            }

            throw new Exception("SubContractor update failed.");
        }
        public async Task<List<SubContractorDto>> DeleteSubContractorAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);

            var result = await _db.QueryFirstOrDefaultAsync<string>(
                "sp_sbs_subContractor_delete",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result != "SUCCESS")
                throw new Exception(result ?? "Failed to delete subcontractor.");

            return await GetSubContractorsAsync(null, null);
        }


    }

}
