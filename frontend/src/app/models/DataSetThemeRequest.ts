export interface DataSetThemeRequest {
  uuid: string; 
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdOn: Date;
  updatedOn: Date;
  iconData?: string;   
  iconPath?: string;   
  icon: string;
}