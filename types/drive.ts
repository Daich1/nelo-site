export interface DriveFile {
  id: string;
  name: string;
  mimeType?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  sizeBytes?: number;
  createdTime?: string;
}

export interface EnsureEventFolderBody {
  eventId: string;
  title?: string;
}

export interface ListFilesQuery {
  eventId: string;
  pageSize?: number;
}

export interface UploadResult {
  file: DriveFile;
}
