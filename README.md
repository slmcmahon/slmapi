## Azure Function Sample using TypeScript & SQL Server 

### Steps

- Clone this repository

- Create the database server:
```
docker run --memory=2G -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=fnrb-0070-cz09-vn0r" -p 1433:1433 -d --name=db-for-azure-fn-sample microsoft/mssql-server-linux:latest
```

- Create the database:
```sql
use master
go

if not exists(select * from sys.databases where name = 'demodb')
  create database demodb
go 

use demodb
go

if not exists(select * from sys.objects where name = 'books' and type = 'u')
  create table books (
      isbn varchar(50) primary key not null,
      title nvarchar(100) not null,
      authors nvarchar(200) not null,
      tags nvarchar(200)
  );
  
if not exists(select * from sys.objects where name = 'people' and type = 'u')
  create table people (
    id int identity(1,1) primary key not null,
    surname nvarchar(50) not null,
    givenName nvarchar(50) not null,
    email nvarchar(50)
  )
```

- Create a local.settings.json file in the root of the project and add the following:
```JSON
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DBUserName": "sa",
    "DBPassword": "fnrb-0070-cz09-vn0r",
    "DBServer": "127.0.0.1",
    "DBName": "demodb"
  }
}
```

- Test your functions using the Postman collection included in the /postman folder
- 