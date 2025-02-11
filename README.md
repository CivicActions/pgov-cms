# Performance.gov

Sandbox Drupal URL: https://performance.ddev.site
Sandbox Frontend URL: http://localhost:3000

## Setup for local sandbox if no database exists
1. `ddev start`
2. `ddev composer install`
3. `ddev drush si --existing-config`


### Setup for local sandbox if you already have a database.
1. `ddev start`
2. `ddev composer install`
3. `ddev drush cim`
4. `ddev drush uli`

## Install frontend
1. `cd src/frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev`

## Contributing
1. Fork the repository.
2. Checkout the `main` branch.
3. Create a new branch: `git checkout -b ticket-number-feature-name`.
4. Make your changes.
5. Push your branch: `git push origin ticket-number-feature-name`.
6. Create a pull request.
7. Request code review and reassign ticket.
8. After code review, assign back to original ticket holder
9. Ticket holder merges their PR and changes ticket status to done

## Deployments

### Pre-requisites
- Install Cloud Foundry CLI: https://docs.cloudfoundry.org/cf-cli/install-go-cli.html
- Login with the CLI: https://docs.cloudfoundry.org/cf-cli/getting-started.html

Deployments to Cloud.gov are accomplished through the use of Cloud Foundry CLI which in turn communicates with the Cloud Foundry API to manage the presrcribed resources. The above pre-requisites should be completed prior to proceeding to the deployment steps below.

To deploy, we utilize the `cf push` CLI command.

Deploy the Drupal backend:
```
cf push PGOV-CMS
```

Deploy the Next.js frontend:
```
cf push PGOV-Frontend
```

