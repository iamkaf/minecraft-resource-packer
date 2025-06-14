import type { ProjectInfo } from '../../main/projects';
import type { PackMeta } from '../project';
import type { ExportSummary } from '../../main/exporter';

export interface IpcRequestMap {
  'list-projects': [];
  'list-versions': [];
  'create-project': [string, string];
  'import-project': [];
  'duplicate-project': [string, string];
  'delete-project': [string];
  'open-project': [string];
  'load-pack-meta': [string];
  'save-pack-meta': [string, PackMeta];
  'add-texture': [string, string];
  'list-textures': [string];
  'get-texture-path': [string, string];
  'get-texture-url': [string, string];
  'randomize-icon': [string];
  'export-project': [string];
  'export-projects': [string[]];
  'open-in-folder': [string];
  'open-file': [string];
  'rename-file': [string, string];
  'delete-file': [string];
  'watch-project': [string];
  'unwatch-project': [string];
  'get-no-export': [string];
  'set-no-export': [string, string, boolean];
}

export interface IpcResponseMap {
  'list-projects': ProjectInfo[];
  'list-versions': string[];
  'create-project': void;
  'import-project': void;
  'duplicate-project': void;
  'delete-project': void;
  'open-project': void;
  'load-pack-meta': PackMeta;
  'save-pack-meta': void;
  'add-texture': void;
  'list-textures': string[];
  'get-texture-path': string;
  'get-texture-url': string;
  'randomize-icon': void;
  'export-project': ExportSummary | void;
  'export-projects': void;
  'open-in-folder': void;
  'open-file': void;
  'rename-file': void;
  'delete-file': void;
  'watch-project': string[];
  'unwatch-project': void;
  'get-no-export': string[];
  'set-no-export': void;
}

export interface IpcEventMap {
  'project-opened': string;
  'file-added': string;
  'file-removed': string;
  'file-renamed': { oldPath: string; newPath: string };
}
