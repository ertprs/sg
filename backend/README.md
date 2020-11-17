# SG API REST

# Migrations
 - npx knex migrate:latest (To run all migrations)
 - npx knex migrate:make migration_name (To run a migration)
 - npx knex migrate:rollback (To rollback)

# Deploy
 - git add .
 - git commit -m"deploy"
 - git push heroku master
 - heroku run npx knex migrate:latest