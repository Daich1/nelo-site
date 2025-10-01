import { google } from "googleapis";

export function getDrive() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const scopes = ["https://www.googleapis.com/auth/drive"];

  const jwt = new google.auth.JWT(clientEmail, undefined, privateKey, scopes);
  return google.drive({ version: "v3", auth: jwt });
}

export const ROOT_FOLDER_ID = process.env.NELO_DRIVE_ROOT_FOLDER_ID!;
