using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.User.Dtos;
using Client.Application.Interfaces;
using Dapper;

namespace Client.Persistence.Repositories
{

    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection _db;

        public UserRepository(IDbConnection db)
        {
            _db = db;
        }
        public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_roleMasterId", userDto.RoleMasterId);
            parameters.Add("@p_username", userDto.Username);
            parameters.Add("@p_password", userDto.Password);
            parameters.Add("@p_createdBy", userDto.CreatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_userMaster_insert",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result == null || result.Status != "SUCCESS")
                throw new Exception($"Insert Failed: {result?.ErrorMessage ?? "Unknown error"}");

            return new UserDto
            {
                Id = result.InsertedID,
                RoleMasterId = userDto.RoleMasterId,
                Username = userDto.Username
            };
        }
        public async Task<List<UserDto>> UpdateUserAsync(UpdateUserDto userDto)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", userDto.Id);
            parameters.Add("@p_roleMasterId", userDto.RoleMasterId);
            parameters.Add("@p_username", userDto.Username);
            parameters.Add("@p_password", userDto.Password);
            parameters.Add("@p_updatedBy", userDto.UpdatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<string>(
                "sp_sbs_userMaster_update",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            if (result != "SUCCESS")
                throw new Exception($"Update failed: {result}");

            return await GetUsersAsync(null,null);
        }



        public async Task<List<UserDto>> GetUsersAsync(int? id, string? search)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);
            parameters.Add("@p_search", search);

            var result = await _db.QueryAsync<UserDto>(
                "sp_sbs_userMaster_get",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result.ToList();
        }
        public async Task<string> DeleteUserAsync(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);

            var result = await _db.QueryFirstOrDefaultAsync<string>(
                "sp_sbs_userMaster_delete",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

    }
}
