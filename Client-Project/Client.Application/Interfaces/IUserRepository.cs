using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Application.Features.User.Dtos;

namespace Client.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<UserDto> CreateUserAsync(CreateUserDto userDto);
        Task<List<UserDto>> UpdateUserAsync(UpdateUserDto userDto);
        Task<string> DeleteUserAsync(int id);


        Task<List<UserDto>> GetUsersAsync(int? id, string? search);
    }
}
