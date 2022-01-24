export interface IFile {
  path: string;
  lastModified: number;
  lastModifiedDate: string;
  name: string;
  size: number;
}

export interface FullFileData {
  file: IFile;
  id: string;
  name: string;
  readableSize: string;
  progress: number;
  uploaded: boolean;
  error: boolean;
  url: string;
}

export interface FileData {
  file: IFile;
  id: string;
  name: string;
  progress: number;
  readableSize: string;
  uploaded: boolean;
  url: string;
  error: boolean;
}
