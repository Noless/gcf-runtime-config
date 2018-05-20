// @flow

import { google } from 'googleapis';

type Variable = {
  name: string,
  value: string,
  updateTime: string,
};

type VariablesArr = Array<Variable>;

type DataVariablesArr = { data: { variables: VariablesArr } };

type GCPAuth = Object;

type Name = string;

type Value = string;

type VariablesObj = { [Name]: Value };

export const getShortVariableName = (name: string) => name.split('/').pop();

export const updateVariableName = (f: string => string) => (v: Variable) => ({
  ...v,
  name: f(v.name),
});

export const getAuth = async (): Promise<GCPAuth> =>
  await google.auth
    .getClient({
      scopes: ['https://www.googleapis.com/auth/cloudruntimeconfig'],
    })
    .catch(() => {
      throw new Error(`Couldn't get auth client with specified scopes.`);
    });

export const getProjectId = async () =>
  await google.auth.getDefaultProjectId().catch(() => {
    throw new Error(`Couldn't get default project id`);
  });

export const getConfigParent = (project: string, config: string) =>
  `projects/${project}/configs/${config}`;

export const getVariablesValuesList = async (
  auth: GCPAuth,
  parent: string,
  returnValues: boolean = true
) =>
  await google
    .runtimeconfig('v1beta1')
    .projects.configs.variables.list({
      auth,
      parent,
      returnValues,
    })
    .catch(() => {
      throw new Error(
        `Couldn't fetch variables list for the specific config, please check its validity.`
      );
    });

export const variablesArrToObj = (variablesArr: VariablesArr) => {
  const variablesObj = {};
  variablesArr.forEach(v => (variablesObj[v.name] = v.value));
  return variablesObj;
};

export const getVariables = async (
  config: string,
  objectify: boolean = true
): Promise<VariablesArr | VariablesObj> => {
  const auth = await exports.getAuth();
  const project = await exports.getProjectId();
  const parent = exports.getConfigParent(project, config);
  const { data }: DataVariablesArr = await exports.getVariablesValuesList(
    auth,
    parent
  );
  const { variables } = data;

  const variablesShortNames = variables.map(
    updateVariableName(getShortVariableName)
  );

  return objectify
    ? variablesArrToObj(variablesShortNames)
    : variablesShortNames;
};
