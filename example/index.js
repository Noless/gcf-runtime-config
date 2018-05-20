const gcfRuntimeConfig = require('gcf-runtime-config');

exports.testRuntimeConfig = (req, res) => {
  gcfRuntimeConfig
    .getVariables('EXAMPLE_ENVIRONMENT')
    .then(variablesObj => res.send(variablesObj))
    .catch(err => res.send(err));
};
