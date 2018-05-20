//@flow
import {
  getAuth,
  getProjectId,
  getVariables,
  getConfigParent,
  variablesArrToObj,
  updateVariableName,
  getShortVariableName,
  getVariablesValuesList,
} from './index';

jest.mock('googleapis');
describe('gcf-runtime-config', () => {
  test('getAuth', async () => {
    const { google } = require('googleapis');
    const expectedScopes = {
      scopes: ['https://www.googleapis.com/auth/cloudruntimeconfig'],
    };
    const expectedAuth = {};

    google.auth.getClient = jest.fn(() => Promise.resolve(expectedAuth));

    expect(await getAuth()).toEqual(expectedAuth);
    expect(google.auth.getClient).toHaveBeenCalledWith(expectedScopes);

    google.auth.getClient = jest.fn(() => Promise.reject());
    try {
      await getAuth();
    } catch (e) {
      expect(e.message).toEqual(
        `Couldn't get auth client with specified scopes.`
      );
    }
  });

  test('getProjectId', async () => {
    const { google } = require('googleapis');
    const projectId = 'testprojectid';
    google.auth.getDefaultProjectId = jest.fn(() => Promise.resolve(projectId));
    expect(await getProjectId()).toEqual(projectId);

    google.auth.getDefaultProjectId = jest.fn(() => Promise.reject());
    try {
      await getProjectId();
    } catch (e) {
      expect(e.message).toEqual(`Couldn't get default project id`);
    }
  });

  test('getVariablesValuesList', async () => {
    const { google } = require('googleapis');
    const variablesArr = [
      { name: 'a', value: '1', updateTime: 'bla' },
      { name: 'b', value: '2', updateTime: 'alb' },
    ];

    let list = jest.fn(() => Promise.resolve(variablesArr));
    let runtimeConfig = { projects: { configs: { variables: { list } } } };
    google.runtimeconfig = () => runtimeConfig;

    const auth = {};
    const parent = 'projects/testproject/configs/testconfig';
    const returnValues = true;

    expect(await getVariablesValuesList(auth, parent, returnValues)).toEqual(
      variablesArr
    );

    list = jest.fn(() => Promise.reject());
    runtimeConfig = { projects: { configs: { variables: { list } } } };
    google.runtimeconfig = () => runtimeConfig;

    try {
      await getVariablesValuesList(auth, parent);
    } catch (e) {
      expect(e.message).toEqual(
        `Couldn't fetch variables list for the specific config, please check its validity.`
      );
    }
  });

  test('getVariables', async () => {
    const auth = {};
    const parent = 'testparent';
    const config = 'testconfig';
    const project = 'testproject';

    const variables = [
      { name: 'e/f/g/a', value: '1', updateTime: 'bla' },
      { name: 'e/f/g/b', value: '2', updateTime: 'alb' },
    ];

    const dataVariables = { data: { variables } };

    const expectedVariablesObj = { a: '1', b: '2' };
    const expectedVariablesArr = [
      { name: 'a', value: '1', updateTime: 'bla' },
      { name: 'b', value: '2', updateTime: 'alb' },
    ];

    const i = require('./index');
    const getAuth = jest.spyOn(i, 'getAuth');
    const getProjectId = jest.spyOn(i, 'getProjectId');
    const getConfigParent = jest.spyOn(i, 'getConfigParent');
    const getVariablesValuesList = jest.spyOn(i, 'getVariablesValuesList');

    getAuth.mockImplementationOnce(() => auth);
    getProjectId.mockImplementationOnce(() => project);
    getConfigParent.mockImplementationOnce(() => parent);
    getVariablesValuesList.mockImplementationOnce(() => dataVariables);

    expect(await getVariables(config)).toEqual(expectedVariablesObj);

    getAuth.mockImplementationOnce(() => auth);
    getProjectId.mockImplementationOnce(() => project);
    getConfigParent.mockImplementationOnce(() => parent);
    getVariablesValuesList.mockImplementationOnce(() => dataVariables);

    const objectify = false;
    expect(await getVariables(config, objectify)).toEqual(expectedVariablesArr);
  });

  test('getConfigParent', () => {
    const project = 'testproject';
    const config = 'testconfig';
    expect(getConfigParent(project, config)).toEqual(
      `projects/${project}/configs/${config}`
    );
  });

  test('variablesArrToObj', () => {
    const variablesArr = [
      { name: 'a', value: '1', updateTime: 'bla' },
      { name: 'b', value: '2', updateTime: 'alb' },
    ];
    const expectedVariablesObj = { a: '1', b: '2' };
    expect(variablesArrToObj(variablesArr)).toEqual(expectedVariablesObj);
  });

  test('getShortVariableName', () => {
    const fullVariableName =
      'projects/testproject/configs/testconfig/variables/testvariable';
    expect(getShortVariableName(fullVariableName)).toEqual('testvariable');
  });

  test('updateVariableName', () => {
    const fullVariableName =
      'projects/testproject/configs/testconfig/variables/testvariable';
    const v = { name: fullVariableName, value: '1', updateTime: 'bla' };
    const expectedV = { name: 'testvariable', value: '1', updateTime: 'bla' };
    expect(updateVariableName(getShortVariableName)(v)).toEqual(expectedV);
  });
});
