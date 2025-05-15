package com.soufiane.open_data.mappers;

import com.soufiane.open_data.dtos.dataSet.DataSetRequest;
import com.soufiane.open_data.dtos.dataSet.DataSetResponse;
import com.soufiane.open_data.entities.DataSet;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DataSetMapper {

    private final ModelMapper modelMapper;

    public DataSet convertToEntity(DataSetRequest dataSetRequest) {
        return modelMapper.map(dataSetRequest, DataSet.class);
    }

    public DataSetResponse convertToResponse(DataSet dataSet) {
        return modelMapper.map(dataSet, DataSetResponse.class);
    }


}