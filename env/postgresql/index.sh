source variables.sh

{ # try
  docker rm postgres-anatogame -f
} || { # catch
  echo "The postgres-anatogame container does not exist"
} 

## Pega a port 5432 (Dentro do container) -> para 5000 (Fora do container)
echo "starting postgres-anatogame container installation"
docker run \
  --name postgres-anatogame \
  -p 5000:5432 \
  -e POSTGRES_PASSWORD=123 \
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
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password CHAR(96) NOT NULL
);