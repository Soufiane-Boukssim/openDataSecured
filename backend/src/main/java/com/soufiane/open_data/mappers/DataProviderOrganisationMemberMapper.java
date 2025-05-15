package com.soufiane.open_data.mappers;

import com.soufiane.open_data.dtos.dataProviderOrganisationMember.DataProviderOrganisationMemberRequest;
import com.soufiane.open_data.dtos.dataProviderOrganisationMember.DataProviderOrganisationMemberResponse;
import com.soufiane.open_data.entities.DataProviderOrganisationMember;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataProviderOrganisationMemberMapper {

    private final ModelMapper modelMapper;
    private final DataProviderOrganisationMapper dataProviderOrganisationMapper;


    public DataProviderOrganisationMember convertToEntity(DataProviderOrganisationMemberRequest dataProviderOrganisationMemberRequest) {
        return modelMapper.map(dataProviderOrganisationMemberRequest, DataProviderOrganisationMember.class);
    }

    public DataProviderOrganisationMemberResponse convertToResponse(DataProviderOrganisationMember dataProviderOrganisationMember) {
        DataProviderOrganisationMemberResponse response = modelMapper.map(dataProviderOrganisationMember, DataProviderOrganisationMemberResponse.class);

        if (dataProviderOrganisationMember.getDataProviderOrganisation() != null) {
            response.setDataProviderOrganisation(
                    dataProviderOrganisationMapper.convertToSimplifiedResponse(dataProviderOrganisationMember.getDataProviderOrganisation())
            );
        }

        return response;
    }


}
