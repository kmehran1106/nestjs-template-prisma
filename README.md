## Tests
```bash
# to up the testenv service from docker compose
$ docker compose up --build testenv -d
$ docker compose up testenv -d
$ docker compose restart testenv -d

# run tests - type 1
$ docker compose exec testenv npm run test:unit
$ docker compose exec testenv npm run test:e2e

# run tests - type 2
$ docker compose exec testenv /bin/sh
$ npm run test:unit
$ npm run test:e2e

# run this to remove the container running the testenv service
$ docker compose down --remove-orphans -v
```
Type 1 is good to run tests just once. But this will be slow if you plan on running tests multiple times during development.

Type 2 will hook you inside the shell of the docker container and running the tests from here will be faster.

## Commands

```bash
# run dev
$ docker compose up --build app -d                    # this will run the dev process

# see logs
$ docker compose logs -f app                          # this will show the logs of the dev process

# prisma
$ docker compose exec app npx prisma init             # only needs to be done once
$ docker compose exec app npx prisma migrate dev      # resets db and migrates everything
$ docker compose exec app npx prisma migrate deploy   # migrates changes to schema to db
$ docker compose exec app npx prisma generate         # generates schema objects for use by modules
$ docker compose exec app npx prisma studio           # database visualizer (not needed)

# others
$ npm run format
$ npm run lint

```
