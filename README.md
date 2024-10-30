# Performance.gov

Sandbox Drupal URL: https://performance.ddev.site
Sandbox Frontend URL: http://localhost:3000

## Stand up a local sandbox
1. ddev start
2. dev composer install
3. ddev drush config:import --source=config
4. ddev drush uli

## Install frontend
1. cd `src frontend`
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. `npm run dev`
5.
## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Push your branch: `git push origin feature-name`.
5. Create a pull request.
