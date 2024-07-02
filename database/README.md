# ICSpaces Database

database setup including migrations (up, down), seeds, procedures, and functions for ICSpaces

## Contents 

- [Overview](#overview)
- [Directory](#directory)
- [How To Run](#how-to-run)
- [Database Connection](#database-connection)
- [Versions](#versions)


## Overview

The database service is using MariaDB (through its official docker image). To easily create/deploy this database service, `docker` is used. 

## Directory 

```
.
├── README.md
├── docker-compose.yaml
├── dev


``` 

- `README.md` - this file that you are reading
- `docker-compose.yaml` - Docker config to initialize `dev`
- `dev` - folder containing create (`up`) SQLs 

## How To Run

### Pre-requisites 

1. Make sure to have [Docker](docker.com) and [Docker Compose](https://docs.docker.com/compose/). You may read installation guidelines [here](https://docs.docker.com/compose/). 
1. Run `docker -v` or `docker-compose -v` from your terminal to test your installations. 
1. Enable Hyper-V in your host machine i.e. enable support for virtualization. 

### Steps 

1. Clone this repository 
1. Enter the repository folder e.g `cd icspaces-db`. 
1. Open a terminal and execute the ff. command: `docker-compose up -d`. This command will build and run a Docker container described by `docker-compose.yaml`, in the background (`-d` flag). 


### Updating your local copy 

1. Set current working directory as the local repository folder. 
1. `git pull origin main` 
1. (if the container is running) `docker-compose down` 
1. Rebuild the container: `docker-compose up --build -d`

### Other Commands 

- `docker exec -it icspaces-db-db-1 bash` - open terminal for container
- `docker-compose down` - close running docker container 
- `docker ps` - check running containers 


## Database Connection 

You can connect to this database using the details you placed in your `.env` configuration. 

Here are the defaults: 

- host: **localhost**
- port: **3306**
- database name: **icspaces**
- database user: none yet
- database password: **icspaces**

## Versions

- MariaDB:   **latest** 
