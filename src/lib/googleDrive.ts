import { google } from "googleapis";

export function getDrive() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const scopes = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
  ];

  if (!clientEmail || !privateKey) {
    throw new Error("Google service account env vars are missing");
  }

  // Vercel では改行が \n として保存されるので置換
  const fixedKey = privateKey.replace(/\\n/g, "\n");

  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: fixedKey,
    scopes,
  });

  return google.drive({ version: "v3", auth: jwt });
}

export const ROOT_FOLDER_ID = process.env.NELO_DRIVE_ROOT_FOLDER_ID!;
