#!/bin/sh

fetchConfiguration(){
  echo "Download the Hub configuration file from \"${ARLAS_HUB_CONFIGURATION_URL}\" ..."
  curl ${ARLAS_HUB_CONFIGURATION_URL} -o /usr/share/nginx/html/config.json && echo "Configuration file downloaded with success." || (echo "Failed to download the configuration file."; exit 1)
}

fetchI18nENContent(){
  echo "Download the en.json file from \"${ARLAS_HUB_I18N_EN_URL}\" ..."
  curl ${ARLAS_HUB_I18N_EN_URL} -o "/usr/share/nginx/html/assets/i18n/en.json" && echo "'EN language' file downloaded with success." || (echo "Failed to download the 'EN language' file."; exit 1)
}

fetchI18nFRContent(){
  echo "Download the fr.json file from \"${ARLAS_HUB_I18N_FR_URL}\" ..."
  curl ${ARLAS_HUB_I18N_FR_URL} -o "/usr/share/nginx/html/assets/i18n/fr.json" && echo "'FR language' file downloaded with success." || (echo "Failed to download the 'FR language' file."; exit 1)
}

### URL to HUB CONFIGURATION
if [ -z "${ARLAS_HUB_CONFIGURATION_URL}" ]; then
  echo "The default hub container configuration file is used"
else
  fetchConfiguration;
fi

### URL to HUB ENG TRANSLATION FILE
if [ -z "${ARLAS_HUB_I18N_EN_URL}" ]; then
  echo "The default 'EN language' file is used"
else
  fetchI18nENContent;
fi

### URL to HUB FRA TRANSLATION FILE
if [ -z "${ARLAS_HUB_I18N_FR_URL}" ]; then
  echo "The default 'FR language' file is used"
else
  fetchI18nFRContent;
fi

### URL to ARLAS-persistence
if [ -z "${ARLAS_PERSISTENCE_URL}" ]; then
  ARLAS_PERSISTENCE_URL="'http://localhost:19997/arlas_persistence_server'"
  export ARLAS_PERSISTENCE_URL
  echo "The default ARLAS-persistence url '${ARLAS_PERSISTENCE_URL}' is used"
else
  echo ${ARLAS_PERSISTENCE_URL} "is used for 'arlas.persistence-server.url'"
fi
envsubst '$ARLAS_PERSISTENCE_URL' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

## AUTHENTICATION
### ARLAS_USE_AUTHENT
if [ -z "${ARLAS_USE_AUTHENT}" ]; then
  ARLAS_USE_AUTHENT=false
  export ARLAS_USE_AUTHENT
  echo "No Authentication variable is set"
else
  echo ${ARLAS_USE_AUTHENT} "is used for 'authentication.use_authent'. Default value is 'false'"
fi
envsubst '$ARLAS_USE_AUTHENT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_USE_AUTHENT
if [ -z "${ARLAS_AUTHENT_FORCE_CONNECT}" ]; then
  ARLAS_AUTHENT_FORCE_CONNECT=false
  export ARLAS_AUTHENT_FORCE_CONNECT
  echo "No Authentication force_connect variable is set"
else
  echo ${ARLAS_AUTHENT_FORCE_CONNECT} "is used for 'authentication.force_connect'. Default value is 'false'"
fi
envsubst '$ARLAS_AUTHENT_FORCE_CONNECT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_USE_DISCOVERY
if [ -z "${ARLAS_AUTHENT_USE_DISCOVERY}" ]; then
  ARLAS_AUTHENT_USE_DISCOVERY=false
  export ARLAS_AUTHENT_USE_DISCOVERY
  echo "No Authentication discovery variable is set"
else
  echo ${ARLAS_AUTHENT_USE_DISCOVERY} "is used for 'authentication.use_discovery'. Default value is 'false'"
fi
envsubst '$ARLAS_AUTHENT_USE_DISCOVERY' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_ISSUER
if [ -z "${ARLAS_AUTHENT_ISSUER}" ]; then
  ARLAS_AUTHENT_ISSUER=NOT_CONFIGURED
  export ARLAS_AUTHENT_ISSUER
  echo "No Authentication issuer variable is set"
else
  echo ${ARLAS_AUTHENT_ISSUER} "is used for 'authentication.issuer'"
fi
envsubst '$ARLAS_AUTHENT_ISSUER' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_CLIENT_ID
if [ -z "${ARLAS_AUTHENT_CLIENT_ID}" ]; then
  ARLAS_AUTHENT_CLIENT_ID=NOT_CONFIGURED
  export ARLAS_AUTHENT_CLIENT_ID
  echo "No Authentication client_id variable is set"
else
  echo ${ARLAS_AUTHENT_CLIENT_ID} "is used for 'authentication.client_id'"
fi
envsubst '$ARLAS_AUTHENT_CLIENT_ID' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_REDIRECT_URI
if [ -z "${ARLAS_AUTHENT_REDIRECT_URI}" ]; then
  ARLAS_AUTHENT_REDIRECT_URI=NOT_CONFIGURED
  export ARLAS_AUTHENT_REDIRECT_URI
  echo "No Authentication redirect_uri variable is set"
else
  echo ${ARLAS_AUTHENT_REDIRECT_URI} "is used for 'authentication.redirect_uri'"
fi
envsubst '$ARLAS_AUTHENT_REDIRECT_URI' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_SILENT_REFRESH_REDIRECT_URI
if [ -z "${ARLAS_AUTHENT_SILENT_REFRESH_REDIRECT_URI}" ]; then
  ARLAS_AUTHENT_SILENT_REFRESH_REDIRECT_URI=NOT_CONFIGURED
  export ARLAS_AUTHENT_SILENT_REFRESH_REDIRECT_URI
  echo "No Authentication silent_refresh_redirect_uri variable is set"
else
  echo ${ARLAS_AUTHENT_SILENT_REFRESH_REDIRECT_URI} "is used for 'authentication.silent_refresh_redirect_uri'"
fi
envsubst '$ARLAS_AUTHENT_SILENT_REFRESH_REDIRECT_URI' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_SCOPE
if [ -z "${ARLAS_AUTHENT_SCOPE}" ]; then
  ARLAS_AUTHENT_SCOPE="NOT_CONFIGURED"
  export ARLAS_AUTHENT_SCOPE
  echo "No Authentication scope variable is set"
else
  echo ${ARLAS_AUTHENT_SCOPE} "is used for 'authentication.scope'"
fi
envsubst '$ARLAS_AUTHENT_SCOPE' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_TOKEN_ENDPOINT
if [ -z "${ARLAS_AUTHENT_TOKEN_ENDPOINT}" ]; then
  ARLAS_AUTHENT_TOKEN_ENDPOINT="NOT_CONFIGURED"
  export ARLAS_AUTHENT_TOKEN_ENDPOINT
  echo "No Authentication token_endpoint variable is set"
else
  echo ${ARLAS_AUTHENT_TOKEN_ENDPOINT} "is used for 'authentication.token_endpoint'"
fi
envsubst '$ARLAS_AUTHENT_TOKEN_ENDPOINT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_USERINFO_ENDPOINT
if [ -z "${ARLAS_AUTHENT_USERINFO_ENDPOINT}" ]; then
  ARLAS_AUTHENT_USERINFO_ENDPOINT="NOT_CONFIGURED"
  export ARLAS_AUTHENT_USERINFO_ENDPOINT
  echo "No Authentication userinfo_endpoint variable is set"
else
  echo ${ARLAS_AUTHENT_USERINFO_ENDPOINT} "is used for 'authentication.userinfo_endpoint'"
fi
envsubst '$ARLAS_AUTHENT_USERINFO_ENDPOINT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_JWKS_ENDPOINT
if [ -z "${ARLAS_AUTHENT_JWKS_ENDPOINT}" ]; then
  ARLAS_AUTHENT_JWKS_ENDPOINT="NOT_CONFIGURED"
  export ARLAS_AUTHENT_JWKS_ENDPOINT
  echo "No Authentication jwks_endpoint variable is set"
else
  echo ${ARLAS_AUTHENT_JWKS_ENDPOINT} "is used for 'authentication.jwks_endpoint'"
fi
envsubst '$ARLAS_AUTHENT_JWKS_ENDPOINT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_LOGIN_URL
if [ -z "${ARLAS_AUTHENT_LOGIN_URL}" ]; then
  ARLAS_AUTHENT_LOGIN_URL="NOT_CONFIGURED"
  export ARLAS_AUTHENT_LOGIN_URL
  echo "No Authentication login_url variable is set"
else
  echo ${ARLAS_AUTHENT_LOGIN_URL} "is used for 'authentication.login_url'"
fi
envsubst '$ARLAS_AUTHENT_LOGIN_URL' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_LOGOUT_URL
if [ -z "${ARLAS_AUTHENT_LOGOUT_URL}" ]; then
  ARLAS_AUTHENT_LOGOUT_URL="NOT_CONFIGURED"
  export ARLAS_AUTHENT_LOGOUT_URL
  echo "No Authentication logout_url variable is set"
else
  echo ${ARLAS_AUTHENT_LOGOUT_URL} "is used for 'authentication.logout_url'"
fi
envsubst '$ARLAS_AUTHENT_LOGOUT_URL' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_SHOW_DEBUG
if [ -z "${ARLAS_AUTHENT_SHOW_DEBUG}" ]; then
  ARLAS_AUTHENT_SHOW_DEBUG=false
  export ARLAS_AUTHENT_SHOW_DEBUG
  echo "No Authentication show_debug_information variable is set. Default value is 'false'"
else
  echo ${ARLAS_AUTHENT_SHOW_DEBUG} "is used for 'authentication.show_debug_information'"
fi
envsubst '$ARLAS_AUTHENT_SHOW_DEBUG' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_REQUIRE_HTTPS
if [ -z "${ARLAS_AUTHENT_REQUIRE_HTTPS}" ]; then
  ARLAS_AUTHENT_REQUIRE_HTTPS=true
  export ARLAS_AUTHENT_REQUIRE_HTTPS
  echo "No Authentication require_https variable is set. Default value is 'true'"
else
  echo ${ARLAS_AUTHENT_REQUIRE_HTTPS} "is used for 'authentication.require_https'"
fi
envsubst '$ARLAS_AUTHENT_REQUIRE_HTTPS' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_RESPONSE_TYPE
if [ -z "${ARLAS_AUTHENT_RESPONSE_TYPE}" ]; then
  ARLAS_AUTHENT_RESPONSE_TYPE="NOT_CONFIGURED"
  export ARLAS_AUTHENT_RESPONSE_TYPE
  echo "No Authentication response_type variable is set."
else
  echo ${ARLAS_AUTHENT_RESPONSE_TYPE} "is used for 'authentication.response_type'"
fi
envsubst '$ARLAS_AUTHENT_RESPONSE_TYPE' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_SILENT_REFRESH_TIMEOUT
if [ -z "${ARLAS_AUTHENT_SILENT_REFRESH_TIMEOUT}" ]; then
  ARLAS_AUTHENT_SILENT_REFRESH_TIMEOUT=5000
  export ARLAS_AUTHENT_SILENT_REFRESH_TIMEOUT
  echo "No Authentication silent_refresh_timeout variable is set. Default value is 5000."
else
  echo ${ARLAS_AUTHENT_SILENT_REFRESH_TIMEOUT} "is used for 'authentication.silent_refresh_timeout'"
fi
envsubst '$ARLAS_AUTHENT_SILENT_REFRESH_TIMEOUT' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_TIMEOUT_FACTOR
if [ -z "${ARLAS_AUTHENT_TIMEOUT_FACTOR}" ]; then
  ARLAS_AUTHENT_TIMEOUT_FACTOR=0.75
  export ARLAS_AUTHENT_TIMEOUT_FACTOR
  echo "No Authentication timeout_factor variable is set. Default value is 0.75"
else
  echo ${ARLAS_AUTHENT_TIMEOUT_FACTOR} "is used for 'authentication.timeout_factor'"
fi
envsubst '$ARLAS_AUTHENT_TIMEOUT_FACTOR' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_ENABLE_SESSION_CHECKS
if [ -z "${ARLAS_AUTHENT_ENABLE_SESSION_CHECKS}" ]; then
  ARLAS_AUTHENT_ENABLE_SESSION_CHECKS=true
  export ARLAS_AUTHENT_ENABLE_SESSION_CHECKS
  echo "No Authentication session_checks_enabled variable is set. Default value is 'true'"
else
  echo ${ARLAS_AUTHENT_ENABLE_SESSION_CHECKS} "is used for 'authentication.session_checks_enabled'"
fi
envsubst '$ARLAS_AUTHENT_ENABLE_SESSION_CHECKS' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_CLEAR_HASH
if [ -z "${ARLAS_AUTHENT_CLEAR_HASH}" ]; then
  ARLAS_AUTHENT_CLEAR_HASH=false
  export ARLAS_AUTHENT_CLEAR_HASH
  echo "No Authentication clear_hash_after_login variable is set. Default value is 'false'"
else
  echo ${ARLAS_AUTHENT_CLEAR_HASH} "is used for 'authentication.clear_hash_after_login'"
fi
envsubst '$ARLAS_AUTHENT_CLEAR_HASH' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_STORAGE
if [ -z "${ARLAS_AUTHENT_STORAGE}" ]; then
  ARLAS_AUTHENT_STORAGE=localstorage
  export ARLAS_AUTHENT_STORAGE
  echo "No Authentication storage variable is set. Default value is 'localstorage'"
else
  echo ${ARLAS_AUTHENT_STORAGE} "is used for 'authentication.storage'"
fi
envsubst '$ARLAS_AUTHENT_STORAGE' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_DISABLE_AT_HASH_CHECK
if [ -z "${ARLAS_AUTHENT_DISABLE_AT_HASH_CHECK}" ]; then
  ARLAS_AUTHENT_DISABLE_AT_HASH_CHECK=false
  export ARLAS_AUTHENT_DISABLE_AT_HASH_CHECK
  echo "No Authentication disable_at_hash_check variable is set. Default value is 'false'"
else
  echo ${ARLAS_AUTHENT_DISABLE_AT_HASH_CHECK} "is used for 'authentication.disable_at_hash_check'"
fi
envsubst '$ARLAS_AUTHENT_DISABLE_AT_HASH_CHECK' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

### ARLAS_AUTHENT_DUMMY_CLIENT_SECRET
if [ -z "${ARLAS_AUTHENT_DUMMY_CLIENT_SECRET}" ]; then
  ARLAS_AUTHENT_DUMMY_CLIENT_SECRET=NOT_CONFIGURED
  export ARLAS_AUTHENT_DUMMY_CLIENT_SECRET
  echo "No Authentication dummy_client_secret variable is set. Default value is NOT_CONFIGURED"
else
  echo ${ARLAS_AUTHENT_DUMMY_CLIENT_SECRET} "is used for 'authentication.dummy_client_secret'"
fi
envsubst '$ARLAS_AUTHENT_DUMMY_CLIENT_SECRET' < /usr/share/nginx/html/settings.yaml > /usr/share/nginx/html/settings.yaml.tmp
mv /usr/share/nginx/html/settings.yaml.tmp /usr/share/nginx/html/settings.yaml

# Set App base href
if [ -z "${ARLAS_HUB_BASE_HREF}" ]; then
  ARLAS_HUB_BASE_HREF=""
  export ARLAS_HUB_BASE_HREF
  echo "No specific base href for the app"
else
  echo ${ARLAS_HUB_BASE_HREF}  "is used as app base href "
fi

envsubst '$ARLAS_HUB_BASE_HREF' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html


nginx -g "daemon off;"
