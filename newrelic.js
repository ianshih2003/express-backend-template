'use strict';

exports.config = {
  app_name: ['{{template}}'],
  license_key: require('./build/config').default.newrelic.license,
  logging: {
    enabled: false,
  },
  attributes: {
    include: ['request.parameters.*'],
  },
};
