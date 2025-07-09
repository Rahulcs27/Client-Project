using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using Client.Application.Features.User.Dtos;
using Client.Application.Interfaces;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;


namespace Client.Persistence.Repositories
{

    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection _db;
        private readonly IConfiguration _config;


        public UserRepository(IDbConnection db , IConfiguration config)
        {
            _db = db;
            _config = config;
        }
        //public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
        //{
        //    var parameters = new DynamicParameters();
        //    parameters.Add("@p_roleMasterId", userDto.RoleMasterId);
        //    parameters.Add("@p_username", userDto.Username);
        //    parameters.Add("@p_password", userDto.Password);
        //    parameters.Add("@p_createdBy", userDto.CreatedBy);

        //    var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
        //        "sp_sbs_userMaster_insert",
        //        parameters,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    if (result == null || result.Status != "SUCCESS")
        //        throw new Exception($"Insert Failed: {result?.ErrorMessage ?? "Unknown error"}");

        //    return new UserDto
        //    {
        //        Id = result.InsertedID,
        //        RoleMasterId = userDto.RoleMasterId,
        //        Username = userDto.Username
        //    };
        //}

    public async Task<UserDto> CreateUserAsync(CreateUserDto userDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var parameters = new DynamicParameters();
        parameters.Add("@p_roleMasterId", userDto.RoleMasterId);
        parameters.Add("@p_companyId", userDto.CompanyId);
            parameters.Add("@p_username", userDto.Username);
        parameters.Add("@p_password", hashedPassword);
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
            CompanyId = userDto.CompanyId,
            Username = userDto.Username
        };
    }
        public async Task<string> LoginAsync(string username, string password)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_search", username);

            var user = (await _db.QueryFirstOrDefaultAsync<UserLoginDto>(
                "sp_sbs_userMaster_get",
                parameters,
                commandType: CommandType.StoredProcedure
            ));

            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                throw new UnauthorizedAccessException("Invalid username or password.");

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(UserLoginDto user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.RoleMasterId.ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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

            return await GetUsersAsync(null,null,2);
        }



        public async Task<List<UserDto>> GetUsersAsync(int? id, string? search,int companyId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);
            parameters.Add("@p_search", search);
            parameters.Add("@p_companyID", companyId);

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
