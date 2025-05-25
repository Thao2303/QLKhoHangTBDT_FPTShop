# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj file and restore
COPY QuanLyKhoHangFPTShop.csproj .
RUN dotnet restore

# Copy rest of the source code
COPY . .
RUN dotnet publish -c Release -o /app/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 5000
ENTRYPOINT ["dotnet", "QuanLyKhoHangFPTShop.dll"]
