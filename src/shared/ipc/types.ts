import type { ProjectInfo } from '../../main/projects';
import type { PackMeta } from '../project';
import type { ExportSummary } from '../../main/exporter';
import type { TextureEditOptions } from '../texture';

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
  'save-pack-icon': [string, string, string];
  'export-project': [string];
  'export-projects': [string[]];
  'open-in-folder': [string];
  'open-file': [string];
  'open-external-editor': [string];
  'read-file': [string];
  'write-file': [string, string];
  'rename-file': [string, string];
  'delete-file': [string];
  'edit-texture': [string, TextureEditOptions];
  'watch-project': [string];
  'unwatch-project': [string];
  'get-no-export': [string];
  'set-no-export': [string, string[], boolean];
  'get-editor-layout': [];
  'set-editor-layout': [number[]];
  'get-texture-editor': [];
  'set-texture-editor': [string];
  'get-confetti-enabled': [];
  'set-confetti-enabled': [boolean];
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
  'save-pack-icon': void;
  'export-project': ExportSummary | void;
  'export-projects': void;
  'open-in-folder': void;
  'open-file': void;
  'open-external-editor': void;
  'read-file': string;
  'write-file': void;
  'rename-file': void;
  'delete-file': void;
  'edit-texture': void;
  'watch-project': string[];
  'unwatch-project': void;
  'get-no-export': string[];
  'set-no-export': void;
  'get-editor-layout': number[];
  'set-editor-layout': void;
  'get-texture-editor': string;
  'set-texture-editor': void;
  'get-confetti-enabled': boolean;
  'set-confetti-enabled': void;
}

export interface IpcEventMap {
  'project-opened': string;
  'file-added': string;
  'file-removed': string;
  'file-renamed': { oldPath: string; newPath: string };
}
