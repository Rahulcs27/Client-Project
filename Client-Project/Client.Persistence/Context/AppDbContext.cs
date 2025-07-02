using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Client.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Client.Persistence.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSet properties for your entities
        public DbSet<CompanyMaster> Companies { get; set; } 
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CompanyMaster>().ToTable("");
            modelBuilder.Entity<Product>().ToTable("");

        }
    }
}
