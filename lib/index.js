'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVariables = exports.variablesArrToObj = exports.getVariablesValuesList = exports.getConfigParent = exports.getProjectId = exports.getAuth = exports.updateVariableName = exports.getShortVariableName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _googleapis = require('googleapis');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getShortVariableName = exports.getShortVariableName = name => name.split('/').pop();

const updateVariableName = exports.updateVariableName = f => v => _extends({}, v, {
  name: f(v.name)
});

const getAuth = exports.getAuth = (() => {
  var _ref = _asyncToGenerator(function* () {
    return yield _googleapis.google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/cloudruntimeconfig']
    }).catch(function () {
      throw new Error(`Couldn't get auth client with specified scopes.`);
    });
  });

  return function getAuth() {
    return _ref.apply(this, arguments);
  };
})();

const getProjectId = exports.getProjectId = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    return yield _googleapis.google.auth.getDefaultProjectId().catch(function () {
      throw new Error(`Couldn't get default project id`);
    });
  });

  return function getProjectId() {
    return _ref2.apply(this, arguments);
  };
})();

const getConfigParent = exports.getConfigParent = (project, config) => `projects/${project}/configs/${config}`;

const getVariablesValuesList = exports.getVariablesValuesList = (() => {
  var _ref3 = _asyncToGenerator(function* (auth, parent, returnValues = true) {
    return yield _googleapis.google.runtimeconfig('v1beta1').projects.configs.variables.list({
      auth,
      parent,
      returnValues
    }).catch(function () {
      throw new Error(`Couldn't fetch variables list for the specific config, please check its validity.`);
    });
  });

  return function getVariablesValuesList(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
})();

const variablesArrToObj = exports.variablesArrToObj = variablesArr => {
  const variablesObj = {};
  variablesArr.forEach(v => {
    if (v.text) {
      variablesObj[v.name] = v.text;
    } else if (v.value) {
      variablesObj[v.name] = Buffer.from(v.value, 'base64').toString();
    } else variablesObj[v.name] = 'No value or text fields';
  });
  return variablesObj;
};

const getVariables = exports.getVariables = (() => {
  var _ref4 = _asyncToGenerator(function* (config, objectify = true) {
    const auth = yield exports.getAuth();
    const project = yield exports.getProjectId();
    const parent = exports.getConfigParent(project, config);
    const { data } = yield exports.getVariablesValuesList(auth, parent);
    const { variables } = data;

    const variablesShortNames = variables.map(updateVariableName(getShortVariableName));
    const variablesObj = variablesArrToObj(variablesShortNames);

    return objectify ? variablesObj : variablesShortNames;
  });

  return function getVariables(_x3) {
    return _ref4.apply(this, arguments);
  };
})();