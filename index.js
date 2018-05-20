// @flow

import { google } from 'googleapis';

type Variable = {|
  name: string,
  value?: string,
  text?: string,
  updateTime: string,
|};

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
  variablesArr.forEach(v => {
    if (v.text) {
      variablesObj[v.name] = v.text;
    } else if (v.value) {
      variablesObj[v.name] = Buffer.from(v.value, 'base64').toString();
    } else variablesObj[v.name] = 'No value or text fields';
  });
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

  const variablesShortNames: Array<Variable> = variables.map(
    updateVariableName(getShortVariableName)
  );
  const variablesObj = variablesArrToObj(variablesShortNames);

  return objectify ? variablesObj : variablesShortNames;
};
