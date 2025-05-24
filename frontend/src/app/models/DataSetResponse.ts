export interface DataSetResponse {
  uuid: string;
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdOn: string;
  updatedOn: string;
  filePath: string;
  file: string;
  fileType: string;
  fileSize: number;
  themeId: number;
  themeUuid: string;  // <-- Ajouté
  dataProviderOrganisationId: number;
  dataProviderOrganisationMemberId: number;
}