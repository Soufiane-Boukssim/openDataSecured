package com.soufiane.open_data.mappers;

import com.soufiane.open_data.dtos.dataProviderOrganisation.DataProviderOrganisationRequest;
import com.soufiane.open_data.dtos.dataProviderOrganisation.DataProviderOrganisationResponse;
import com.soufiane.open_data.dtos.dataProviderOrganisation.SimplifiedDataProviderOrganisationResponse;
import com.soufiane.open_data.entities.DataProviderOrganisation;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataProviderOrganisationMapper {

    private final ModelMapper modelMapper;

    public DataProviderOrganisation convertToEntity(DataProviderOrganisationRequest dataProviderOrganisationRequest) {
        return modelMapper.map(dataProviderOrganisationRequest, DataProviderOrganisation.class);
    }

    public DataProviderOrganisationResponse convertToResponse(DataProviderOrganisation dataProviderOrganisation) {
        return modelMapper.map(dataProviderOrganisation, DataProviderOrganisationResponse.class);
    }

    public SimplifiedDataProviderOrganisationResponse convertToSimplifiedResponse(DataProviderOrganisation dataProviderOrganisation) {
        return modelMapper.map(dataProviderOrganisation, SimplifiedDataProviderOrganisationResponse.class);
    }
}
