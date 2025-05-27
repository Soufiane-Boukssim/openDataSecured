package com.soufiane.open_data.services.dataSet;

import com.soufiane.open_data.dtos.dataSet.DataSetResponse;
import com.soufiane.open_data.entities.*;
import com.soufiane.open_data.exceptions.ResourceNotFoundException;
import com.soufiane.open_data.mappers.DataSetMapper;
import com.soufiane.open_data.repositories.*;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;


import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;


@Service @RequiredArgsConstructor
public class DataSetServiceImplementation implements DataSetService {

    private final DataSetRepository dataSetRepository;
    private final DataProviderOrganisationRepository dataProviderOrganisationRepository;
    private final DataProviderOrganisationMemberRepository dataProviderOrganisationMemberRepository;
    private final DataSetThemeRepository dataSetThemeRepository;

    private final DataSetMapper dataSetMapper;

    private static final String UPLOAD_DIR = System.getProperty("user.dir").replace("\\", "/") + "/uploads/documents/datasets/";
    private static final String fileUrl = "http://localhost:8080/api/datasets/upload/file/";
    private final DataSetSportRepository dataSetSportRepository;
    private final DataSetFinanceRepository dataSetFinanceRepository;
    private final DataSetEnvironmentRepository dataSetEnvironmentRepository;

    @Override
    public List<DataSetResponse> getAllDataSet() {
        List<DataSetResponse> dataSetResponseList = new ArrayList<>();
        List<DataSet> dataSetList = dataSetRepository.findByDeletedFalse();
        if (dataSetList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Is Empty");
        }
        for (DataSet dataSet : dataSetList) {
            dataSetResponseList.add(dataSetMapper.convertToResponse(dataSet));
        }
        return dataSetResponseList;
    }

    @Override
    public List<DataSetResponse> getAllDataSetByTheme(String themeName) {
        List<DataSetResponse> dataSetResponseList = new ArrayList<>();
        List<DataSet> dataSets = dataSetRepository.findByTheme_NameAndDeletedFalse(themeName);
        if (dataSets.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Not Found with theme " + themeName);
        }
        for (DataSet dataSet : dataSets) {
            dataSetResponseList.add(dataSetMapper.convertToResponse(dataSet));
        }
        return dataSetResponseList;
    }

    @Override
    public List<DataSetResponse> getAllDataSetByProvider(String provider) {
        List<DataSetResponse> dataSetResponseList = new ArrayList<>();
        List<DataSet> dataSetList = dataSetRepository.findByDataProviderOrganisation_NameAndDeletedFalse(provider);
        if (dataSetList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Not Found with provider " + provider);
        }
        for (DataSet dataSet : dataSetList) {
            dataSetResponseList.add(dataSetMapper.convertToResponse(dataSet));
        }
        return dataSetResponseList;
    }

    @Override
    public DataSetResponse getDataSetById(UUID uuid) {
        DataSet dataSet= dataSetRepository.findByUuidAndDeletedFalse(uuid);
        if (dataSet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Not Found with uuid " + uuid);
        }
        return dataSetMapper.convertToResponse(dataSet);
    }

    @Override
    public DataSetResponse getDataSetByName(String name) {
        DataSet dataSet= dataSetRepository.findByNameAndDeletedFalse(name);
        if (dataSet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Not Found with name " + name);
        }
        return dataSetMapper.convertToResponse(dataSet);
    }

    @Override
    public DataSetResponse saveDataSet(String name, String description, UUID themeUuid, UUID dataProviderOrganisationMemberUuid, MultipartFile file) throws IOException {
        validateDataSetInput(name, description, themeUuid, dataProviderOrganisationMemberUuid, file);
        DataSetTheme theme = checkIfThemeExists(themeUuid);
        DataProviderOrganisationMember provider = checkIfDataProviderOrganisationMemberExists(dataProviderOrganisationMemberUuid);
        checkUniqueDataSetName(name);
        ensureUploadDirectoryExists();
        DataSet dataSet = createDataSet(name, description, theme, provider, file);
        dataSet= dataSetRepository.save(dataSet);

        //
        // Étape 2 : lire le fichier Excel
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        // Étape 3 : insérer les lignes dans la bonne table
        switch (theme.getName().toLowerCase()) {
            case "sport":
                enregistrerDataSetSport(sheet, dataSet.getId());
                break;
            case "finance":
                enregistrerDataSetFinance(sheet, dataSet.getId());
                break;
            case "environnement":
                enregistrerDataSetEnvironnement(sheet, dataSet.getId());
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thème non reconnu pour insertion des données.");
        }


        return dataSetMapper.convertToResponse(dataSet);
    }



    private void enregistrerDataSetSport(Sheet sheet, Long dataSetId) {

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null || isRowEmptySport(row)) {
                System.out.println("➡️ Ligne vide ignorée à l’index " + i);
                continue;
            }

            try {
                DataSetSport sport = new DataSetSport();

                sport.setNomEvenement(getStringValue(row.getCell(0)));
                sport.setDescription(getStringValue(row.getCell(1)));
                sport.setTheme(getStringValue(row.getCell(2)));

                Date date = row.getCell(3).getDateCellValue();
                LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                sport.setDatePublication(localDate);

                sport.setTypeSport(getStringValue(row.getCell(4)));
                sport.setLocalisation(getStringValue(row.getCell(5)));
                sport.setParticipants(getStringValue(row.getCell(6)));
                sport.setResultat(getStringValue(row.getCell(7)));

                sport.setGid(dataSetId); // lien avec DataSet

                dataSetSportRepository.save(sport);

            } catch (Exception e) {
                System.err.println("❌ Erreur à la ligne " + i + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private boolean isRowEmptySport(Row row) {
        if (row == null) return true;
        for (int i = 0; i < 8; i++) {
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                if (cell.getCellType() == CellType.STRING && !cell.getStringCellValue().trim().isEmpty()) {
                    return false;
                }
                if (cell.getCellType() != CellType.STRING) {
                    return false;
                }
            }
        }
        return true;
    }

    private String getStringValue(Cell cell) {
        if (cell == null) return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }






    // 2. Ajoutez cette nouvelle méthode pour traiter les données financières :
    private void enregistrerDataSetFinance(Sheet sheet, Long dataSetId) {
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null || isRowEmptyFinance(row)) {
                System.out.println("➡️ Ligne vide ignorée à l'index " + i);
                continue;
            }

            try {
                DataSetFinance finance = new DataSetFinance();

                finance.setAnneeBudgetaire(getStringValue(row.getCell(0)));
                finance.setNomBeneficiaire(getStringValue(row.getCell(1)));
                finance.setNumeroSiret(getStringValue(row.getCell(2)));
                finance.setObjetDossier(getStringValue(row.getCell(3)));

                // Gestion du montant voté (colonne 4)
                Cell montantCell = row.getCell(4);
                if (montantCell != null) {
                    if (montantCell.getCellType() == CellType.NUMERIC) {
                        finance.setMontantVote(montantCell.getNumericCellValue());
                    } else if (montantCell.getCellType() == CellType.STRING) {
                        try {
                            String montantStr = montantCell.getStringCellValue().trim();
                            if (!montantStr.isEmpty()) {
                                // Nettoyer la chaîne (enlever les espaces, virgules, etc.)
                                montantStr = montantStr.replaceAll("[\\s,]", "").replace(",", ".");
                                finance.setMontantVote(Double.parseDouble(montantStr));
                            }
                        } catch (NumberFormatException e) {
                            System.err.println("⚠️ Montant invalide à la ligne " + i + ": " + montantCell.getStringCellValue());
                            finance.setMontantVote(null);
                        }
                    }
                }

                finance.setDirection(getStringValue(row.getCell(5)));
                finance.setNatureSubvention(getStringValue(row.getCell(6)));
                finance.setGid(dataSetId); // lien avec DataSet

                dataSetFinanceRepository.save(finance);

            } catch (Exception e) {
                System.err.println("❌ Erreur à la ligne " + i + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }


    // 3. Méthode pour vérifier si une ligne finance est vide :
    private boolean isRowEmptyFinance(Row row) {
        if (row == null) return true;
        for (int i = 0; i < 7; i++) { // 7 colonnes pour finance
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                if (cell.getCellType() == CellType.STRING && !cell.getStringCellValue().trim().isEmpty()) {
                    return false;
                }
                if (cell.getCellType() != CellType.STRING) {
                    return false;
                }
            }
        }
        return true;
    }


    ///////////////////3/////////////////
    private void enregistrerDataSetEnvironnement(Sheet sheet, Long dataSetId) {
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null || isRowEmptyEnvironment(row)) {
                System.out.println("➡️ Ligne vide ignorée à l’index " + i);
                continue;
            }

            try {
                DataSetEnvironment environment = new DataSetEnvironment();

                environment.setNomDeLaDonnee(getStringValue(row.getCell(0)));
                environment.setDescription(getStringValue(row.getCell(1)));
                environment.setTheme(getStringValue(row.getCell(2)));

                Date date = row.getCell(3).getDateCellValue();
                LocalDate localDate = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                environment.setDateDePublication(localDate);

                environment.setUniteDeMesure(getStringValue(row.getCell(4)));

                // Gestion de la valeur (colonne 5)
                Cell valeurCell = row.getCell(5);
                if (valeurCell != null) {
                    if (valeurCell.getCellType() == CellType.NUMERIC) {
                        environment.setValeur(valeurCell.getNumericCellValue());
                    } else if (valeurCell.getCellType() == CellType.STRING) {
                        try {
                            String valeurStr = valeurCell.getStringCellValue().trim();
                            if (!valeurStr.isEmpty()) {
                                // Nettoyer la chaîne (enlever les espaces, virgules, etc.)
                                valeurStr = valeurStr.replaceAll("[\\s,]", "").replace(",", ".");
                                environment.setValeur(Double.parseDouble(valeurStr));
                            }
                        } catch (NumberFormatException e) {
                            System.err.println("⚠️ Valeur invalide à la ligne " + i + ": " + valeurCell.getStringCellValue());
                            environment.setValeur(null);
                        }
                    }
                }

                environment.setLieu(getStringValue(row.getCell(6)));
                environment.setSource(getStringValue(row.getCell(7)));

                environment.setGid(dataSetId); // lien avec DataSet

                dataSetEnvironmentRepository.save(environment);

            } catch (Exception e) {
                System.err.println("❌ Erreur à la ligne " + i + ": " + e.getMessage());
                e.printStackTrace();
            }
        }

    }



    private boolean isRowEmptyEnvironment(Row row) {
        if (row == null) return true;
        for (int i = 0; i < 8; i++) { // 7 colonnes pour finance
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                if (cell.getCellType() == CellType.STRING && !cell.getStringCellValue().trim().isEmpty()) {
                    return false;
                }
                if (cell.getCellType() != CellType.STRING) {
                    return false;
                }
            }
        }
        return true;
    }











    @Override
    public DataSetResponse updateDataSetById(UUID uuid, String name, String description, UUID themeUuid, UUID dataProviderOrganisationMemberUuid, MultipartFile file) throws IOException {

        if (dataProviderOrganisationMemberUuid == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le champ 'dataProviderOrganisationMemberUuid' est vide.");
        }

        DataSet existingDataSet= dataSetRepository.findByUuidAndDeletedFalse(uuid);
        if (existingDataSet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Not Found with uuid " + uuid);
        }

        DataProviderOrganisationMember member = dataProviderOrganisationMemberRepository.findByUuidAndDeletedFalse(dataProviderOrganisationMemberUuid);
        if (member == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataProviderOrganisationMember Not Found with uuid " + dataProviderOrganisationMemberUuid);
        }

        if (name != null) {
            existingDataSet.setName(name);
        }
        if (description != null) {
            existingDataSet.setDescription(description);
        }
        if (themeUuid != null) {
            existingDataSet.setTheme(dataSetThemeRepository.findByUuidAndDeletedFalse(themeUuid));
        }
        existingDataSet.setDataProviderOrganisationMember(dataProviderOrganisationMemberRepository.findByUuidAndDeletedFalse(dataProviderOrganisationMemberUuid));
        existingDataSet.setDataProviderOrganisation(dataProviderOrganisationMemberRepository.findByUuidAndDeletedFalse(dataProviderOrganisationMemberUuid).getDataProviderOrganisation());

        if (file != null && !file.isEmpty()) {
            String uniqueFileName = saveFileToDisk(file);
            existingDataSet.setFileData(file.getBytes());
            existingDataSet.setFilePath(UPLOAD_DIR + uniqueFileName);
            existingDataSet.setFile(fileUrl + uniqueFileName);
            existingDataSet.setFileType(file.getContentType());
            existingDataSet.setFileSize(file.getSize());
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        existingDataSet.setUpdatedBy(email);

        existingDataSet= dataSetRepository.save(existingDataSet);
        return dataSetMapper.convertToResponse(existingDataSet);
    }

    @Override
    public Boolean deleteDataSetById(UUID uuid) {
        DataSet existingDataSet= dataSetRepository.findByUuidAndDeletedFalse(uuid);
        if (existingDataSet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "DataSet Not Found with uuid " + uuid);
        }
        existingDataSet.setDeleted(true);
        dataSetRepository.save(existingDataSet);
        return true;
    }

    @Override
    public Long getNumberOfDataSet() {
        return dataSetRepository.countByDeletedFalse();
    }

    @Override
    public byte[] getFile(String fileName) throws IOException {
        Path filePath = Paths.get(UPLOAD_DIR+'/'+fileName);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("Le fichier " + fileName + " n'existe pas.");
        }
        return Files.readAllBytes(filePath);
    }



    @Override
    public ByteArrayInputStream generateTemplateWithData(Long datasetId) throws IOException {
        DataSet dataSet = dataSetRepository.findById(datasetId)
                .orElseThrow(() -> new ResourceNotFoundException("Dataset not found"));

        List<DataSetSport> sportData = dataSet.getDataSetSports(); // Si c'est un dataset de type sport

        // Charger le fichier template (Apache POI)
        InputStream templateStream = new FileInputStream(dataSet.getFilePath());
        XSSFWorkbook workbook = new XSSFWorkbook(templateStream);
        XSSFSheet sheet = workbook.getSheetAt(0);

        int rowIndex = 1; // Commence à remplir à partir de la 2e ligne
        for (DataSetSport item : sportData) {
            XSSFRow row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(item.getNomEvenement());
            row.createCell(1).setCellValue(item.getDescription());
            row.createCell(2).setCellValue(item.getTheme());
            row.createCell(3).setCellValue(item.getDatePublication().toString());
            row.createCell(4).setCellValue(item.getTypeSport());
            row.createCell(5).setCellValue(item.getLocalisation());
            row.createCell(6).setCellValue(item.getParticipants());
            row.createCell(7).setCellValue(item.getResultat());
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        return new ByteArrayInputStream(outputStream.toByteArray());
    }



    private void validateDataSetInput(String name, String description, UUID themeUuid, UUID dataProviderOrganisationMemberUuid, MultipartFile file) {
        List<String> errors = new ArrayList<>();
        if (name == null || name.trim().isEmpty()) errors.add("Le champ 'name' est vide");
        if (description == null || description.trim().isEmpty()) errors.add("Le champ 'description' est vide");
        if (themeUuid == null) errors.add("Le champ 'theme' est vide");
        if (dataProviderOrganisationMemberUuid == null) errors.add("Le champ 'dataProviderOrganisationMemberUuid' est vide");
        if (file == null || file.isEmpty()) errors.add("Le champ 'file' est vide");
        if (!errors.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erreur(s): " + String.join(", ", errors) + ".");
        }
    }

    private DataSetTheme checkIfThemeExists(UUID themeUuid) {
        DataSetTheme theme = dataSetThemeRepository.findByUuidAndDeletedFalse(themeUuid);
        if (theme == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Le thème spécifié n'existe pas ou a été supprimé.");
        }
        return theme;
    }

    private DataProviderOrganisationMember checkIfDataProviderOrganisationMemberExists(UUID dataProviderOrganisationMemberUuid) {
        DataProviderOrganisationMember provider = dataProviderOrganisationMemberRepository.findByUuidAndDeletedFalse(dataProviderOrganisationMemberUuid);
        if (provider == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Le provider spécifié n'existe pas ou a été supprimé.");
        }
        return provider;
    }

    private void ensureUploadDirectoryExists() throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    }

    private void checkUniqueDataSetName(String name) {
        if (dataSetRepository.findByNameAndDeletedFalse(name) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un DataSet avec le nom '" + name + "' existe déjà.");
        }
    }

    private DataSet createDataSet(String name, String description, DataSetTheme theme, DataProviderOrganisationMember provider, MultipartFile file) throws IOException {
        DataSet dataSet = new DataSet();
        dataSet.setUuid(UUID.randomUUID());
        dataSet.setName(name);
        dataSet.setDescription(description);
        dataSet.setTheme(theme);
        dataSet.setDataProviderOrganisationMember(provider);
        dataSet.setDataProviderOrganisation(provider.getDataProviderOrganisation());
        dataSet.setCreatedBy(provider.getEmail());
        if (file != null && !file.isEmpty()) {
            String uniqueFileName = saveFileToDisk(file);
            dataSet.setFileData(file.getBytes());
            dataSet.setFilePath(UPLOAD_DIR + uniqueFileName);
            dataSet.setFile(fileUrl + uniqueFileName);

            dataSet.setFileType(file.getContentType());
            dataSet.setFileSize(file.getSize());
        }
        return dataSet;
    }

    private String saveFileToDisk(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new IOException("Nom de fichier invalide.");
        }

        String sanitizedFileName = StringUtils.cleanPath(originalFileName);
        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(sanitizedFileName);
        int counter = 1;
        while (Files.exists(filePath)) {
            String fileNameWithoutExt = FilenameUtils.getBaseName(sanitizedFileName);
            String extension = FilenameUtils.getExtension(sanitizedFileName);
            String newFileName = fileNameWithoutExt + "_" + counter + (extension.isEmpty() ? "" : "." + extension);
            filePath = uploadPath.resolve(newFileName);
            counter++;
        }

        Files.write(filePath, file.getBytes());

        return filePath.getFileName().toString();
    }

}
