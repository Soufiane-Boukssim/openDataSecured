export interface DataSetThemeRequest {
  uuid: string; // UUID sous forme de string
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdOn: Date;
  updatedOn: Date;
  iconData?: string;   // Chaine base64 reçue côté client
  iconPath?: string;   // Url data:image/... à générer côté client
  icon: string;
}