package com.soufiane.open_data.dtos.dataProviderOrganisation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DataProviderOrganisationResponse {
    private UUID uuid;
    private String name;
    private String description;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private byte[] iconData;
    private String iconPath;
    private String icon;
}
