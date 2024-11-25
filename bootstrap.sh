#!/bin/bash
set -euo pipefail

SECRETS=$(echo "$VCAP_SERVICES" | jq -r '.["user-provided"][] | select(.name == "secrets") | .credentials')
APP_NAME=$(echo "$VCAP_APPLICATION" | jq -r '.name')
APP_ROOT=$(dirname "${BASH_SOURCE[0]}")
DOC_ROOT="$APP_ROOT/web"
APP_ID=$(echo "$VCAP_APPLICATION" | jq -r '.application_id')

DB_NAME=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.db_name')
DB_USER=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.username')
DB_PW=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.password')
DB_HOST=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.host')
DB_PORT=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.port')

S3_BUCKET=$(echo "$VCAP_SERVICES" | jq -r '.["s3"][]? | select(.name == "storage") | .credentials.bucket')
export S3_BUCKET
S3_REGION=$(echo "$VCAP_SERVICES" | jq -r '.["s3"][]? | select(.name == "storage") | .credentials.region')
export S3_REGION
if [ -n "$S3_BUCKET" ] && [ -n "$S3_REGION" ]; then
  # Add Proxy rewrite rules to the top of the htaccess file
  sed "s/^#RewriteRule .s3fs/RewriteRule ^s3fs/" "$DOC_ROOT/template-.htaccess" > "$DOC_ROOT/.htaccess"
else
  cp "$DOC_ROOT/template-.htaccess" "$DOC_ROOT/.htaccess"
fi

install_drupal() {
    ROOT_USER_NAME=$(echo "$SECRETS" | jq -r '.ROOT_USER_NAME')
    ROOT_USER_PASS=$(echo "$SECRETS" | jq -r '.ROOT_USER_PASS')

    : "${ROOT_USER_NAME:?Need and root user name for Drupal}"
    : "${ROOT_USER_PASS:?Need and root user pass for Drupal}"

    drush si \
     --db-url=mysql://uq1zt3ea0stw0p3z:pga2byyc7ix82opm8dn4gkvxk@cg-aws-broker-prodkb8a3b2jajdvt7q.ci7nkegdizyy.us-gov-west-1.rds.amazonaws.com:3306/cgawsbrokerprodkb8a3b2jajdvt7 \
     --account-name="$ROOT_USER_NAME" \
     --account-pass="$ROOT_USER_PASS" \
     --existing-config
}

if [ "${CF_INSTANCE_INDEX:-''}" == "0" ] && [ "${APP_NAME}" == "PGOV-CMS" ]; then

  # Go into the Drupal web root directory
  cd "$DOC_ROOT"

  # If there is no "config:import" command, Drupal needs to be installed
  drush list | grep "config:import" > /dev/null || install_drupal

  # Secrets
#  ADMIN_EMAIL=$(echo "$SECRETS" | jq -r '.ADMIN_EMAIL')
#  drupal config:override system.site --key mail --value "$ADMIN_EMAIL" > /dev/null
#  drupal config:override update.settings --key notification.emails.0 --value "$ADMIN_EMAIL" > /dev/null

  # Import initial content
  drush migrate

  # Clear the cache
  drush cache:rebuild
fi
