package com.soufiane.open_data.dtos.dataSet;

import com.soufiane.open_data.dtos.dataProviderOrganisation.SimplifiedDataProviderOrganisationResponse;
import com.soufiane.open_data.dtos.dataProviderOrganisationMember.SimplifiedDataProviderOrganisationMemberResponse;
import com.soufiane.open_data.dtos.dataSetTheme.SimplifiedDataSetThemeResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DataSetResponse {
    private Long id; //pour gid pour DataSetSport, DataSetFinance, DataSetEnvironment
    private UUID uuid;
    private String name;
    private String description;
    private String createdBy;
    private String updatedBy;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private String filePath;
    private String file;
    private String fileType;
    private Long fileSize;

    private SimplifiedDataSetThemeResponse dataSetTheme;
    private SimplifiedDataProviderOrganisationResponse dataProviderOrganisation;
    private SimplifiedDataProviderOrganisationMemberResponse dataProviderOrganisationMember;
}
