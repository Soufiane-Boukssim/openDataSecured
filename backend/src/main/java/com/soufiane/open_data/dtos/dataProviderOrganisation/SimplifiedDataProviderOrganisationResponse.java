package com.soufiane.open_data.dtos.dataProviderOrganisation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SimplifiedDataProviderOrganisationResponse {
    private UUID uuid;
    private String name;
}