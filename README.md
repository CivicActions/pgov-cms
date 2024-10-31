# Performance.gov

Sandbox Drupal URL: https://performance.ddev.site
Sandbox Frontend URL: http://localhost:3000

## Initial setup for local sandbox
1. ddev start
2. dev composer install

### If no local database exists
1. In config/core.extension.yml, Change the lines that read standard: 1000 and profile: standard to minimal: 1000 and profile: minimal (to switch the configured install profile to minimal)
2. ddev drush sql:drop && drush si --existing-config
3. ddev drush cim

### If you already have a local database for your sandbox
1. ddev drush cim
2. ddev drush uli

## Install frontend
1. cd `src frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev`

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b ticket-number-feature-name`.
3. Make your changes.
4. Push your branch: `git push origin ticket-number-feature-name`.
5. Create a pull request.
6. Request code review and reassign ticket.
7. After code review, assign back to original ticket holder
8. Ticket holder merges their PR and changes ticket status to done
