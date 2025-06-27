# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy toàn bộ source code (bao gồm MLModels + wwwroot)
COPY . ./

# Restore và build
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy build output
COPY --from=build /app/out ./

# ✅ Copy thư mục MLModels nếu dùng ML.NET
COPY --from=build /app/MLModels ./MLModels

# ✅ Copy static files như ảnh
COPY --from=build /app/wwwroot ./wwwroot

EXPOSE 5000
ENTRYPOINT ["dotnet", "QuanLyKhoHangFPTShop.dll"]
