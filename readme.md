
## Gcloud and API 

API rest load file from bucket to Cloud SQL table:  https://cloud.google.com/sql/docs/mysql/import-export/import-export-csv?hl=es-419#rest-v1_1

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

## Get Access Token

Get access token from service current  https://cloud.google.com/compute/docs/access/authenticate-workloads?hl=es-419

```cmd
curl "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" \
-H "Metadata-Flavor: Google"
```

## Connect to mysql

```cmd
mysql -h <<host> -u <<username>> -p <<instance>>
```

## Create table
```sql
CREATE TABLE pruebamzv (
    sku varchar(11),
    name varchar(100),
    price decimal(40,6)
    );
```
