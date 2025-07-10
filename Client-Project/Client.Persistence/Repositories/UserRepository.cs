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

        public async Task<List<UserDto>> CreateUserAsync(CreateUserDto userDto)
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

            if (result == null || result.R_Status != "SUCCESS")
                throw new Exception($"Insert Failed: {result?.R_ErrorMessage ?? "Unknown error"}");

            int insertedId = result.R_InsertedID; 
            int companyId = userDto.CompanyId;

            return (await GetUsersAsync(null, null, companyId));
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
            new Claim(ClaimTypes.Role,user.RoleName),
            new Claim("companyId",user.CompanyId.ToString())
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
            parameters.Add("@p_companyId", userDto.CompanyId);
            parameters.Add("@p_username", userDto.Username);
            parameters.Add("@p_updatedBy", userDto.UpdatedBy);
            //var verifiedUsers = await GetUsersAsync(userDto.Id, null, userDto.CompanyId);
            //var verifiedUser = verifiedUsers.FirstOrDefault();

            if(!userDto.NewPassword.IsNullOrEmpty() && !userDto.CurrentPassword.IsNullOrEmpty())
            {
                if (userDto == null || !BCrypt.Net.BCrypt.Verify(userDto.CurrentPassword, userDto.Password))
                    throw new UnauthorizedAccessException("Password does not match.");
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.NewPassword);
                parameters.Add("@p_password", hashedPassword);
            }
            else if (userDto.NewPassword.IsNullOrEmpty() && userDto.CurrentPassword.IsNullOrEmpty())
            {
                parameters.Add("@p_password", userDto.Password);
            }
            else
            {
                throw new ArgumentException("Both NewPassword and CurrentPassword must be provided or neither.");
            }

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                    "sp_sbs_userMaster_update",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

            if (result == null || result.R_Status != "SUCCESS")
                throw new Exception($"Update failed: {result?.R_ErrorMessage ?? "Unknown error"}");

            int updatedId = result.R_UpdatedID;

            return await GetUsersAsync(null, null, userDto.CompanyId);
        }



        public async Task<List<UserDto>> GetUsersAsync(int? id, string? search,int? companyId)
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
        public async Task<List<UserDto>> DeleteUserAsync(int id, int updatedBy,int companyId)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@p_id", id);
            parameters.Add("@p_updatedBy", updatedBy);

            var result = await _db.QueryFirstOrDefaultAsync<dynamic>(
                "sp_sbs_userMaster_delete",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            if (result == null || result.R_Status != "SUCCESS")
                throw new Exception($"Update failed: {result?.R_ErrorMessage ?? "Unknown error"}");

            return await GetUsersAsync(null, null, companyId);

        }

    }
}
