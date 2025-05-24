package com.soufiane.open_data.controllers;

import com.soufiane.open_data.dtos.dataSet.DataSetResponse;
import com.soufiane.open_data.services.dataSet.DataSetService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor @RequestMapping("/api/datasets")
public class DataSetController {

    private final DataSetService dataSetService;

    @GetMapping("/get/all")
    public List<DataSetResponse> getAllDataSets() {
        return dataSetService.getAllDataSet();
    }

    @GetMapping("/get/allByTheme/{themeName}")
    public List<DataSetResponse> getAllDataSetsByTheme(@PathVariable String themeName) {
        return dataSetService.getAllDataSetByTheme(themeName);
    }

    @GetMapping("/get/allByProvider/{provider}")
    public List<DataSetResponse> getAllDataSetByProvider(@PathVariable String provider) {
        return dataSetService.getAllDataSetByProvider(provider);
    }

    @GetMapping("/get/byId/{uuid}")
    public DataSetResponse getDataSetById(@PathVariable UUID uuid) {
        return dataSetService.getDataSetById(uuid);
    }

    @GetMapping("/get/byName/{name}")
    public DataSetResponse getDataSetByName(@PathVariable String name) {
        return dataSetService.getDataSetByName(name);
    }


    @PostMapping("/save")
    public ResponseEntity<DataSetResponse> saveDataSet(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) UUID themeUuid,
            @RequestParam(required = false) UUID dataProviderOrganisationMemberUuid,
            @RequestParam(required = false) MultipartFile file) throws IOException{
        DataSetResponse dataSetResponse = dataSetService.saveDataSet(name, description, themeUuid, dataProviderOrganisationMemberUuid, file);
        return ResponseEntity.ok(dataSetResponse);
    }

    @PutMapping(value = "/update/byId/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<DataSetResponse> updateDataSet(
            @PathVariable UUID id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "themeUuid", required = false) UUID themeUuid,
            @RequestParam(value = "dataProviderOrganisationMemberUuid", required = false) UUID dataProviderOrganisationMemberUuid,
            @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
        DataSetResponse updatedDataSet = dataSetService.updateDataSetById(id, name, description, themeUuid, dataProviderOrganisationMemberUuid, file);
        return ResponseEntity.ok(updatedDataSet);
    }

    @DeleteMapping("/delete/byId/{id}")
    public Boolean deleteDataSet(@PathVariable UUID id) {
        return dataSetService.deleteDataSetById(id);
    }

    @GetMapping("/count")
    public Long getNumberOfDataSets(){
        return dataSetService.getNumberOfDataSet();
    }

    @GetMapping("/upload/file/{fileName}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) throws IOException {
        byte[] fileContent = dataSetService.getFile(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileContent);
    }


    @GetMapping("/template/excel/{theme}")
    public void downloadExcelTemplate(@PathVariable String theme, HttpServletResponse response) throws IOException {
        String[] headers;

        // Définir les headers en fonction du thème
        switch (theme.toLowerCase()) {
            case "environnement":
                headers = new String[]{"Nom de la donnée", "Description", "Thème", "Date de publication", "Unité de mesure", "Valeur", "Lieu", "Source"};
                break;
            case "sport":
                headers = new String[]{"Nom de l’événement", "Description", "Thème", "Date de publication", "Type de sport", "Localisation", "Participants", "Résultat"};
                break;
            case "finance":
                headers = new String[]{"Année budgétaire", "Nom bénéficiaire", "Numéro Siret", "Objet du dossier", "Montant voté", "Direction", "Nature de la subvention"};
                break;
            default:
                headers = new String[]{"Nom", "Description", "Thème", "Date de publication"};
        }

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Template");

        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=template_" + theme + ".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }



}