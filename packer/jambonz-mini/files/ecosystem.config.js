module.exports = {
  apps : [
  {
    name: 'jambonz-api-server',
    cwd: '/home/admin/apps/jambonz-api-server',
    script: 'app.js',
    out_file: '/home/admin/.pm2/logs/jambonz-api-server.log',
    err_file: '/home/admin/.pm2/logs/jambonz-api-server.log',
    combine_logs: true,
    instance_var: 'INSTANCE_ID',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      JAMBONES_MYSQL_HOST: '$${JAMBONES_MYSQL_HOST}',
      JAMBONES_MYSQL_USER: '$${JAMBONES_MYSQL_USER}',
      JAMBONES_MYSQL_PASSWORD: '$${JAMBONES_MYSQL_PASSWORD}',
      JAMBONES_MYSQL_DATABASE: 'jambones',
      JAMBONES_MYSQL_CONNECTION_LIMIT: 10,
      JAMBONES_REDIS_HOST: '$${JAMBONES_REDIS_HOST}',
      JAMBONES_REDIS_PORT: 6379,
      JAMBONES_LOGLEVEL: 'info',
      JAMBONE_API_VERSION: 'v1',
      JAMBONES_CREATE_CALL_URL: 'http://127.0.0.1:4001/v1/createCall',
      HTTP_PORT:  3000
		},
  },
  {
    name: 'sbc-call-router',
    cwd: '/home/admin/apps/sbc-call-router',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    out_file: '/home/admin/.pm2/logs/jambonz-sbc-call-router.log',
    err_file: '/home/admin/.pm2/logs/jambonz-sbc-call-router.log',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      HTTP_PORT:  4000,
      JAMBONES_INBOUND_ROUTE: '127.0.0.1:4002',
      JAMBONES_OUTBOUND_ROUTE: '127.0.0.1:4003',
      JAMBONZ_TAGGED_INBOUND: 1,
      JAMBONES_NETWORK_CIDR: '172.31.32.0/24'
		}
  },
  {
    name: 'jambonz-feature-server',
    cwd: '/home/admin/apps/jambonz-feature-server',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    out_file: '/home/admin/.pm2/logs/jambonz-feature-server.log',
    err_file: '/home/admin/.pm2/logs/jambonz-feature-server.log',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      GOOGLE_APPLICATION_CREDENTIALS: '/home/admin/credentials/$${GOOGLE_APPLICATION_CREDENTIALS}',
      AWS_ACCESS_KEY_ID: '$${AWS_ACCESS_KEY_ID}',
      AWS_SECRET_ACCESS_KEY: '${{AWS_SECRET_ACCESS_KEY}',
      AWS_REGION: '$${AWS_REGION}',
      ENABLE_DATADOG_METRICS: 0,
      ENABLE_DATADOG_METRICS: 0,
      JAMBONES_NETWORK_CIDR: '172.31.32.0/24',
      JAMBONES_MYSQL_HOST: '$${JAMBONES_MYSQL_HOST}',
      JAMBONES_MYSQL_USER: '$${JAMBONES_MYSQL_USER}',
      JAMBONES_MYSQL_PASSWORD: '$${JAMBONES_MYSQL_PASSWORD}',
      JAMBONES_MYSQL_DATABASE: 'jambones',
      JAMBONES_MYSQL_CONNECTION_LIMIT: 10,
      JAMBONES_REDIS_HOST: '$${JAMBONES_REDIS_HOST}',
      JAMBONES_REDIS_PORT: 6379,
      JAMBONES_LOGLEVEL: 'debug',
      HTTP_PORT: 4001,
      DRACHTIO_HOST: '127.0.0.1',
      DRACHTIO_PORT: 9023,
      DRACHTIO_SECRET: 'cymru',
      JAMBONES_SBCS: '172.31.32.100:5060',
      JAMBONES_FEATURE_SERVERS: '127.0.0.1:9023:cymru',
      JAMBONES_FREESWITCH: '127.0.0.1:8021:JambonzR0ck$'
		}
  },
  {
    name: 'sbc-registrar',
    cwd: '/home/admin/apps/sbc-registrar',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    out_file: '/home/admin/.pm2/logs/jambonz-sbc-registrar.log',
    err_file: '/home/admin/.pm2/logs/jambonz-sbc-registrar.log',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      ENABLE_DATADOG_METRICS: 0,
      JAMBONES_LOGLEVEL: 'debug',
      DRACHTIO_HOST: '127.0.0.1',
      DRACHTIO_PORT: 9022,
      DRACHTIO_SECRET: 'cymru',
      JAMBONES_MYSQL_HOST: '$${JAMBONES_MYSQL_HOST}',
      JAMBONES_MYSQL_USER: '$${JAMBONES_MYSQL_USER}',
      JAMBONES_MYSQL_PASSWORD: '$${JAMBONES_MYSQL_PASSWORD}',
      JAMBONES_MYSQL_DATABASE: 'jambones',
      JAMBONES_MYSQL_CONNECTION_LIMIT: 10,
      JAMBONES_REDIS_HOST: '$${JAMBONES_REDIS_HOST}',
      JAMBONES_REDIS_PORT: 6379,
		}
  },
  {
    name: 'sbc-outbound',
    cwd: '/home/admin/apps/sbc-outbound',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    out_file: '/home/admin/.pm2/logs/jambonz-sbc-outbound.log',
    err_file: '/home/admin/.pm2/logs/jambonz-sbc-outbound.log',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      JAMBONES_LOGLEVEL: 'debug',
      ENABLE_DATADOG_METRICS: 0,
      DRACHTIO_HOST: '127.0.0.1',
      DRACHTIO_PORT: 9022,
      DRACHTIO_SECRET: 'cymru',
      JAMBONES_RTPENGINES: '127.0.0.1:22222',
      JAMBONES_MYSQL_HOST: '$${JAMBONES_MYSQL_HOST}',
      JAMBONES_MYSQL_USER: '$${JAMBONES_MYSQL_USER}',
      JAMBONES_MYSQL_PASSWORD: '$${JAMBONES_MYSQL_PASSWORD}',
      JAMBONES_MYSQL_DATABASE: 'jambones',
      JAMBONES_MYSQL_CONNECTION_LIMIT: 10,
      JAMBONES_REDIS_HOST: '$${JAMBONES_REDIS_HOST}',
      JAMBONES_REDIS_PORT: 6379,
		}
  },
  {
    name: 'sbc-inbound',
    cwd: '/home/admin/apps/sbc-inbound',
    script: 'app.js',
    instance_var: 'INSTANCE_ID',
    out_file: '/home/admin/.pm2/logs/jambonz-sbc-inbound.log',
    err_file: '/home/admin/.pm2/logs/jambonz-sbc-inbound.log',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      JAMBONES_LOGLEVEL: 'debug',
      ENABLE_DATADOG_METRICS: 0,
      DRACHTIO_HOST: '127.0.0.1',
      DRACHTIO_PORT: 9022,
      DRACHTIO_SECRET: 'cymru',
      JAMBONES_FEATURE_SERVERS: '172.31.3.33:5070',
      JAMBONES_RTPENGINES: '127.0.0.1:22222',
      JAMBONES_MYSQL_HOST: '$${JAMBONES_MYSQL_HOST}',
      JAMBONES_MYSQL_USER: '$${JAMBONES_MYSQL_USER}',
      JAMBONES_MYSQL_PASSWORD: '$${JAMBONES_MYSQL_PASSWORD}',
      JAMBONES_MYSQL_DATABASE: 'jambones',
      JAMBONES_MYSQL_CONNECTION_LIMIT: 10,
      JAMBONES_REDIS_HOST: '$${JAMBONES_REDIS_HOST}',
      JAMBONES_REDIS_PORT: 6379,
		}
  }]
};