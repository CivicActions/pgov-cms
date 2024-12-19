#!/bin/bash
set -euo pipefail

# Initialize our own variables:
verbose=0
noop=0

# Check function
while getopts "v:nh" opt; do
    case "$opt" in
	v)	verbose=$OPTARG
		;;
	n)	noop=1
		;;
	h)  manpage=1
		;;
    esac
done

shift $((OPTIND-1))

# [ "$1" = "--" ] && shift

if [ ! -z "${manpage+isset}" ];
then
	printf "Performance.gov bootstrap script
Options:
	-v N		Verbosity level
	-n  		No Op - dry run
	-h			Help - print this text\n\n"
	exit 0
fi

 export home="/home/vcap"
 export app_path="${home}/app"
 export apt_path="${home}/deps/0/apt"

 ## Updated ~/.bashrc to update $PATH
 [ -z $(cat ${home}/.bashrc | grep PATH) ] && \
   touch ${home}/.bashrc && \
   echo "alias nano=\"${home}/deps/0/apt/bin/nano\"" >> ${home}/.bashrc
   echo "PATH=$PATH:/home/vcap/app/php/bin:/home/vcap/app/vendor/drush/drush" >> /home/vcap/.bashrc

 source ${home}/.bashrc

## App Info
SECRETS=$(echo "$VCAP_SERVICES" | jq -r '.["user-provided"][] | select(.name == "secrets") | .credentials')
APP_NAME=$(echo "$VCAP_APPLICATION" | jq -r '.name')
APP_ROOT=$(dirname "${BASH_SOURCE[0]}")
DOC_ROOT="$APP_ROOT/web"
APP_ID=$(echo "$VCAP_APPLICATION" | jq -r '.application_id')
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
then
	printf "\nApp Info\n"
fi
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 2 ]
then
	for appinfo in SECRETS APP_NAME APP_ROOT DOC_ROOT APP_ID
	do
		printf "%s :\t%s\n" "${appinfo}" "${!appinfo}"
	done
fi

## DB Info
DB_NAME=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.db_name')
DB_USER=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.username')
DB_PW=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.password')
DB_HOST=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.host')
DB_PORT=$(echo "$VCAP_SERVICES" | jq -r '.["aws-rds"][] | .credentials.port')
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
then
	printf "\nDB Info\n"
fi
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 2 ]
then
	for appinfo in DB_NAME DB_USER DB_PW DB_HOST DB_PORT
	do
		printf "%s :\t%s\n" "${appinfo}" "${!appinfo}"
	done
fi

## S3 Info
S3_BUCKET=$(echo "$VCAP_SERVICES" | jq -r '.["s3"][]? | select(.name == "storage") | .credentials.bucket')
export S3_BUCKET
S3_REGION=$(echo "$VCAP_SERVICES" | jq -r '.["s3"][]? | select(.name == "storage") | .credentials.region')
export S3_REGION
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
then
	printf "\nS3 Info\n"
fi
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 2 ]
then
	for appinfo in S3_BUCKET S3_REGION
	do
		printf "%s :\t%s\n" "${appinfo}" "${!appinfo}"
	done
fi

if [ -n "$S3_BUCKET" ] && [ -n "$S3_REGION" ]; then
  # Add Proxy rewrite rules to the top of the htaccess file
  sed "s/^#RewriteRule .s3fs/RewriteRule ^s3fs/" "$DOC_ROOT/template-.htaccess" > "$DOC_ROOT/.htaccess"
else
  cp "$DOC_ROOT/template-.htaccess" "$DOC_ROOT/.htaccess"
fi

install_drupal() {
	if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
	then
		printf "\ninstall_drupal called on %s\n" "${APP_ID}"
	fi

	ROOT_USER_NAME=$(echo "$SECRETS" | jq -r '.ROOT_USER_NAME')
	ROOT_USER_PASS=$(echo "$SECRETS" | jq -r '.ROOT_USER_PASS')

	: "${ROOT_USER_NAME:?Need root user name for Drupal}"
	: "${ROOT_USER_PASS:?Need root user pass for Drupal}"

	if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
	then
		printf "\nRunning drush site-install\n"
	fi
	drush site-install minimal --existing-config \
    	--db-url="mysql://$DB_USER:$DB_PW@$DB_HOST:$DB_PORT/$DB_NAME" \
    	--account-name="$ROOT_USER_NAME" \
    	--account-pass="$ROOT_USER_PASS" \
    	-y

 	if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
	then
		printf "\nImporting previous database\n"
	fi
	drush sql-drop -y
   	drush sql-cli < ../db/performancedb.sql

	# Set site uuid to match our config
	if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
	then
		printf "\nSet Site UUID\n"
	fi
	UUID=$(grep uuid ../config/system.site.yml | cut -d' ' -f2)
	drush config:set "system.site" uuid "$UUID" --yes
	if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
	then
		printf "\nSite UUID set to: %s\n" "${UUID}"
	fi
}

# Go into the Drupal web root directory
cd "$DOC_ROOT"

# If there is no "config:import" command, Drupal needs to be installed
drush list | grep "config:import" > /dev/null || install_drupal

# Clear the cache
if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
then
	printf "\nRebuild cache and update DB\n"
fi

drush deploy

 # Set basic auth credentials
 chmod 775 /home/vcap/app/apache2
 htpasswd -b -c /home/vcap/app/apache2/.htpasswd  admin civicactions

 # Restart nginx
# service nginx restart

if [ "${verbose+isset}" ] && [ "${verbose}" -ge 1 ]
then
	printf "\nDone\n"
fi
