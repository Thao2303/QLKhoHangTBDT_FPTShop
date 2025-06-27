# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy everything (bao gồm cả MLModels trước khi restore để đảm bảo có sẵn)
COPY . ./

# Restore and publish
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy output + MLModels folder từ build stage
COPY --from=build /app/out ./
COPY --from=build /app/MLModels ./MLModels

EXPOSE 5000
ENTRYPOINT ["dotnet", "QuanLyKhoHangFPTShop.dll"]
