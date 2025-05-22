package com.soufiane.open_data.mappers;

import com.soufiane.open_data.dtos.dataSetTheme.DataSetThemeRequest;
import com.soufiane.open_data.dtos.dataSetTheme.DataSetThemeResponse;
import com.soufiane.open_data.entities.DataSetTheme;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataSetThemeMapper {

    private final ModelMapper modelMapper;

    public DataSetTheme convertToEntity(DataSetThemeRequest dataSetThemeRequest) {
        return modelMapper.map(dataSetThemeRequest, DataSetTheme.class);
    }

    public DataSetThemeResponse convertToResponse(DataSetTheme dataSetTheme) {
        return modelMapper.map(dataSetTheme, DataSetThemeResponse.class);
    }
}