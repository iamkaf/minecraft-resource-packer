/* c8 ignore start */
import type { ProjectInfo, ImportSummary } from '../../main/projects';
import type { PackMeta } from '../project';
import type { ExportSummary } from '../../main/exporter';
import type { TextureEditOptions } from '../texture';
import type { PackFormatInfo } from '../packFormat';

export interface IpcRequestMap {
  'list-projects': [];
  'list-formats': [];
  'create-project': [string, string];
  'import-project': [];
  'duplicate-project': [string, string];
  'rename-project': [string, string];
  'delete-project': [string];
  'open-project': [string];
  'load-pack-meta': [string];
  'save-pack-meta': [string, PackMeta];
  'add-texture': [string, string];
  'list-textures': [string];
  'get-texture-path': [string, string];
  'get-texture-url': [string, string];
  'create-atlas': [string, string[]];
  'randomize-icon': [string];
  'save-pack-icon': [string, string, string];
  'export-project': [string];
  'export-projects': [string[]];
  'open-project-folder': [string];
  'open-in-folder': [string];
  'open-file': [string];
  'open-external-editor': [string];
  'read-file': [string];
  'write-file': [string, string];
  'save-revision': [string, string, string];
  'list-revisions': [string, string];
  'restore-revision': [string, string, string];
  'delete-revision': [string, string, string];
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
  'get-theme': [];
  'set-theme': ['light' | 'dark' | 'system'];
  'get-confetti': [];
  'set-confetti': [boolean];
  'get-default-export-dir': [];
  'set-default-export-dir': [string];
  'get-project-sort': [];
  'set-project-sort': [keyof ProjectInfo, boolean];
  'get-asset-search': [];
  'set-asset-search': [string];
  'get-asset-filters': [];
  'set-asset-filters': [string[]];
  'get-asset-zoom': [];
  'set-asset-zoom': [number];
  'get-open-last-project': [];
  'set-open-last-project': [boolean];
  'get-last-project': [];
  'set-last-project': [string];
  log: [string, string];
}

export interface IpcResponseMap {
  'list-projects': ProjectInfo[];
  'list-formats': PackFormatInfo[];
  'create-project': void;
  'import-project': ImportSummary | null;
  'duplicate-project': void;
  'rename-project': void;
  'delete-project': void;
  'open-project': void;
  'load-pack-meta': PackMeta;
  'save-pack-meta': void;
  'add-texture': void;
  'list-textures': string[];
  'get-texture-path': string;
  'get-texture-url': string;
  'create-atlas': string;
  'randomize-icon': void;
  'save-pack-icon': void;
  'export-project': ExportSummary | void;
  'export-projects': void;
  'open-project-folder': void;
  'open-in-folder': void;
  'open-file': void;
  'open-external-editor': void;
  'read-file': string;
  'write-file': void;
  'save-revision': void;
  'list-revisions': string[];
  'restore-revision': void;
  'delete-revision': void;
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
  'get-theme': 'light' | 'dark' | 'system';
  'set-theme': void;
  'get-confetti': boolean;
  'set-confetti': void;
  'get-default-export-dir': string;
  'set-default-export-dir': void;
  'get-project-sort': { key: keyof ProjectInfo; asc: boolean };
  'set-project-sort': void;
  'get-asset-search': string;
  'set-asset-search': void;
  'get-asset-filters': string[];
  'set-asset-filters': void;
  'get-asset-zoom': number;
  'set-asset-zoom': void;
  'get-open-last-project': boolean;
  'set-open-last-project': void;
  'get-last-project': string;
  'set-last-project': void;
  log: void;
}
/* c8 ignore end */

export interface IpcEventMap {
  'project-opened': string;
  'file-added': string;
  'file-removed': string;
  'file-renamed': { oldPath: string; newPath: string };
  'file-changed': { path: string; stamp: number };
}
