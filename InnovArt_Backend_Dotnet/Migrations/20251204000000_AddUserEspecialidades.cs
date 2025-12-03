using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InnovArt.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserEspecialidades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Especialidades",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Especialidades",
                table: "Users");
        }
    }
}
