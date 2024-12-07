#!/bin/sh
#
# This script will attempt to clean up the drupal install in cloud.gov
#

# delete apps
cf delete cronish -f
cf delete web -f

# delete services
cf delete-service database -f
cf delete-service secrets -f
cf delete-service storage -f

echo "Manually delete routes"
cf routes
