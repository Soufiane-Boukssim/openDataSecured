package com.soufiane.open_data.controllers;

import com.soufiane.open_data.dtos.dataProviderOrganisation.DataProviderOrganisationResponse;
import com.soufiane.open_data.dtos.dataProviderOrganisationMember.DataProviderOrganisationMemberResponse;
import com.soufiane.open_data.services.dataProviderOrganisation.DataProviderOrganisationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor @RequestMapping("/api/data-provider/organisations")
public class DataProviderOrganisationController {
    private final DataProviderOrganisationService dataProviderOrganisationService;

    @GetMapping("/get/all")
    public List<DataProviderOrganisationResponse> getAllProviders() {
        return dataProviderOrganisationService.getAllDataProviderOrganisations();
    }

    @GetMapping("/{organisationId}/members")
    public List<DataProviderOrganisationMemberResponse> getAllMembersOfOrganisation(@PathVariable UUID organisationId) {
        return dataProviderOrganisationService.getAllMembersOfOrganisation(organisationId);
    }


    @GetMapping("/get/byId/{uuid}")
    public DataProviderOrganisationResponse getProviderById(@PathVariable UUID uuid) {
        return dataProviderOrganisationService.getDataProviderOrganisationById(uuid);
    }

    @GetMapping("/get/byName/{name}")
    public DataProviderOrganisationResponse getProviderByName(@PathVariable String name) {
        return dataProviderOrganisationService.getDataProviderOrganisationByName(name);
    }

    @PutMapping(value = "/update/byId/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<DataProviderOrganisationResponse> updateProviderById(
            @PathVariable UUID id,
            @RequestParam(value = "name",required = false) String name,
            @RequestParam(value = "description",required = false) String description,
            @RequestParam(value = "icon",required = false) MultipartFile icon) throws IOException {
        DataProviderOrganisationResponse updatedProvider= dataProviderOrganisationService.updateDataProviderOrganisationById(id, name, description, icon);
        return ResponseEntity.ok(updatedProvider);
    }

    @PostMapping("/save")
    public ResponseEntity<DataProviderOrganisationResponse> saveProvider(
            @RequestParam(value = "name") String name,
            @RequestParam("description") String description,
            @RequestParam(value = "icon") MultipartFile file) throws IOException {
        DataProviderOrganisationResponse savedProvider = dataProviderOrganisationService.saveDataProviderOrganisation(name,description,file);
        return ResponseEntity.ok(savedProvider);
    }

    @DeleteMapping("/delete/byId/{id}")
    public Boolean deleteProvider(@PathVariable UUID id) {
        return dataProviderOrganisationService.deleteDataProviderOrganisationById(id);
    }

    @GetMapping("/count")
    public Long getNumberOfOrganisation() {
        return dataProviderOrganisationService.getNumberOfDataProviderOrganisations();
    }

    @GetMapping("/upload/image/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName) throws IOException {
        byte[] image = dataProviderOrganisationService.getDataProviderOrganisationImage(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(image);
    }

    @PostMapping("/{organisationId}/assign-user/{userId}")
    public ResponseEntity<?> assignUserToOrganisation(
            @PathVariable UUID organisationId,
            @PathVariable UUID userId) {
        dataProviderOrganisationService.assignUserToOrganisation(organisationId, userId);
        return ResponseEntity.ok("User with the id: "+userId+" is assigned successfully to the organisation with the id: "+organisationId);
    }



}
