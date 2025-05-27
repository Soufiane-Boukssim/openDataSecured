package com.soufiane.open_data.dtos.dataSetTheme;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SimplifiedDataSetThemeResponse {
    private Long id;
    private UUID uuid;
    private String name;
}
