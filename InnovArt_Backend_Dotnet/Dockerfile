# ETAPA 1: Construcción (Usamos el SDK de .NET 9)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiamos los archivos del proyecto (asegúrate de que copie todo desde la carpeta actual)
COPY . .

# Restauramos dependencias y publicamos
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# ETAPA 2: Ejecución (Usamos solo el Runtime de .NET 9, más ligero)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Configuración de puerto para Render (.NET 8 y 9 usan el puerto 8080 por defecto)
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

# IMPORTANTE: Reemplaza "NombreDeTuProyecto.dll" por el nombre real de tu archivo .csproj pero terminando en .dll
# Ejemplo: Si tu archivo es Innovart.csproj, pon Innovart.dll
ENTRYPOINT ["dotnet", "InnovArt.Backend.dll"]