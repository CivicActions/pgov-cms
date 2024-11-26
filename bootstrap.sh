#!/bin/bash
set -euo pipefail

SECRETS=$(echo "$VCAP_SERVICES" | jq -r '.["user-provided"][] | select(.name == "secrets") | .credentials')
APP_NAME=$(echo "$VCAP_APPLICATION" | jq -r '.name')
APP_ROOT=$(dirname "${BASH_SOURCE[0]}")
DOC_ROOT="$APP_ROOT/web"

DB_NAME=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.db_name')
DB_USER=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.username')
DB_PW=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.password')
DB_HOST=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.host')
DB_PORT=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.port')

S3_BUCKET=$(echo "$VCAP_SERVICES" | jq -r '.["s3"][]? | select(.name == "storage") | .credentials.bucket')
export S3_BUCKET
S3_REGION=$(echo "$VCAP_SERVICES" | jq -r '.["s3"][]? | select(.name == "storage") | .credentials.region')
export S3_REGION

#if [ -n "$S3_BUCKET" ] && [ -n "$S3_REGION" ]; then
#  # Add Proxy rewrite rules to the top of the htaccess file
#  sed "s/^#RewriteRule .s3fs/RewriteRule ^s3fs/" "$DOC_ROOT/template-.htaccess" > "$DOC_ROOT/.htaccess"
#else
#  cp "$DOC_ROOT/template-.htaccess" "$DOC_ROOT/.htaccess"
#fi

export home="/home/vcap"

## Updated ~/.bashrc to update $PATH
[ -z $(cat ${home}/.bashrc | grep PATH) ] && \
  touch ${home}/.bashrc && \
  echo "alias nano=\"${home}/deps/0/apt/bin/nano\"" >> ${home}/.bashrc && \
  echo "PATH=${PATH}:/home/apt/usr/bin/mysql" >> /home/vcap/.bashrc

source ${home}/.bashrc

install_drupal() {
    ROOT_USER_NAME=$(echo "$SECRETS" | jq -r '.ROOT_USER_NAME')
    ROOT_USER_PASS=$(echo "$SECRETS" | jq -r '.ROOT_USER_PASS')

    : "${ROOT_USER_NAME:?Need and root user name for Drupal}"
    : "${ROOT_USER_PASS:?Need and root user pass for Drupal}"

    drush si \
     --account-name="$ROOT_USER_NAME" \
     --account-pass="$ROOT_USER_PASS" \
     --existing-config
}

if [ "${CF_INSTANCE_INDEX:-''}" == "0" ] && [ "${APP_NAME}" == "PGOV-CMS" ]; then

  # make sure database is created
#  echo "create database $DB_NAME" | mysql --host="$DB_HOST" --port="$DB_PORT" --user="$DB_USER" --password="$DB_PW" || true

  # Go into the Drupal web root directory
  cd "$DOC_ROOT"

  # If no drupal version is returned, Drupal needs to be installed
  install_drupal


  # Import initial content
  cd "$APP_ROOT"
  chmod +x ./bin/migrate && ./bin/migrate

  # Go into the Drupal web root directory
  cd "$DOC_ROOT"

  # Clear the cache
  drush cache:rebuild
fi
