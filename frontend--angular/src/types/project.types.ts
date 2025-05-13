export type ListProjectPath = {
  name: string;
  path: string;
  type: Type;
  children: Child[];
};

export type Child = {
  name: string;
  path: string;
  type: Type;
  children?: Child[];
  size?: number;
  modified?: Date;
};

export enum Type {
  Directory = 'directory',
  File = 'file',
}

export type SetFileProject = {
  action: 'create' | 'update';
  filename: string;
  pathfile: string;
  data: string;
};
