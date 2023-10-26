## Get Access Token

See https://cloud.google.com/compute/docs/access/authenticate-workloads?hl=es-419

```cmd
curl "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" \
-H "Metadata-Flavor: Google"
```

## Gcloud and API 

See https://cloud.google.com/sql/docs/mysql/import-export/import-export-csv?hl=es-419#rest-v1_1

```cmd
curl -X POST \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d @request.json \
    "https://sqladmin.googleapis.com/v1/projects/<<project-id>>/instances/<<instance-id>>/import"
```

Request Json:

```json
{
 "importContext":
   {
      "fileType": "CSV",
      "uri": "gs://bucket_name/path_to_csv_file",
      "database": "database_name",
      "csvImportOptions":
       {
         "table": "table_name"
       }
   }
}
```

## Connect to mysql

```cmd
mysql -h 34.29.74.69 -u umonitoreo -p DBMONITOREO
```

## Create table
```sql
CREATE TABLE mzv_test (
    column1 varchar(100),
    column2 varchar(100),
    column3 varchar(100),
    comlumn4 bigint
    );
```
