import { DataProviderOrganisationRequest } from "./DataProviderOrganisationRequest";

export interface DataProviderOrganisationMemberRequest {
  uuid: string; 
  firstName: string;
  lastName: string;
  email: string;
  createdBy: string;
  updatedBy: string;
  createdOn: Date;
  updatedOn: Date;
  dataProviderOrganisation?:DataProviderOrganisationRequest //uuid et name
}

