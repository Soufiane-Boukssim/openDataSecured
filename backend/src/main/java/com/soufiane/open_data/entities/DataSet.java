package com.soufiane.open_data.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity @Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DataSet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private UUID uuid;
    @Column(nullable = false, unique = true)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String createdBy;
    private String updatedBy;
    @CreationTimestamp
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    @PreUpdate
    protected void onUpdate() {
        this.updatedOn = LocalDateTime.now();
    }
    @Column(nullable = false)
    private boolean deleted = false;
    @Lob @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData;
    private String filePath;
    private String file;
    private String fileType;
    private Long fileSize;
    @ManyToOne @JoinColumn(name = "theme_id")
    private DataSetTheme theme;

    // Organisation propriétaire
    @ManyToOne @JoinColumn(name = "data_provider_organisation_id")
    private DataProviderOrganisation dataProviderOrganisation;

    // Utilisateur qui a créé ce dataset
    @ManyToOne @JoinColumn(name = "data_provider_user_id")
    private DataProviderOrganisationMember dataProviderOrganisationMember;

    @OneToMany @JoinColumn(name = "gid", referencedColumnName = "id")
    private List<DataSetSport> dataSetSports;

    @OneToMany @JoinColumn(name = "gid", referencedColumnName = "id")
    private List<DataSetFinance> dataSetFinances;

    @OneToMany @JoinColumn(name = "gid", referencedColumnName = "id")
    private List<DataSetEnvironnement> dataSetEnvironnements;

}
