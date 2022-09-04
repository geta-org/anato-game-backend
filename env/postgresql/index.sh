source variables.sh

{ # try
  docker rm postgres-anatogame -f
} || { # catch
  echo "The postgres-anatogame container does not exist"
} 

echo "starting postgres-anatogame container installation"
docker run \ 
  --name postgres-anatogame \ 
  -p 5000:5432 \ ## Pega a port 5432 (Dentro do container) -> para 5000 (Fora do container)
  -e POSTGRES_PASSWORD=123456 \ 
  -d postgres 


## Need create user for readonly
## Need create user for edit (CRUD)
## Need create user for admin database (Create, migration)
## Create database anatogamedev ## Temporary
create database anatogamedev
  with owner 'postgres' 
  encoding 'UTF8'

## Create script of privileges

## Create table users
create table users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password CHAR(64) NOT NULL
);