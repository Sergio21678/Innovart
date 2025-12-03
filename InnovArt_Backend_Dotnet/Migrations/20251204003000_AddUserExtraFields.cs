using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InnovArt.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserExtraFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ciudad",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FotoPerfil",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Pais",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ciudad",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "FotoPerfil",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Pais",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Users");
        }
    }
}
