package com.soufiane.open_data.dtos.dataProviderOrganisationMember;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SimplifiedDataProviderOrganisationMemberResponse {
    private UUID uuid;
    private String email;
}
