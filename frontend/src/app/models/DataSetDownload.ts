import { SimplifiedDataProviderOrganisationMemberResponse } from "./SimplifiedDataProviderOrganisationMemberResponse";
import { SimplifiedDataProviderOrganisationResponse } from "./SimplifiedDataProviderOrganisationResponse";

export interface DataSetDownload {
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
  themeUuid: string;  
  dataProviderOrganisation: SimplifiedDataProviderOrganisationResponse;
  dataProviderOrganisationMember: SimplifiedDataProviderOrganisationMemberResponse;
}