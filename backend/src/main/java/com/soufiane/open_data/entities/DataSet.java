package com.soufiane.open_data.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DataSet {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) //@JsonIgnore
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
    @ManyToOne @JoinColumn(name = "theme_id") //@JsonIgnoreProperties({"id", "name", "description", "createdBy", "updatedBy", "createdOn", "updatedOn", "deleted", "iconPath", "datasets","base64Icon", "icon"})
    private DataSetTheme theme;

    // Organisation propriétaire
    @ManyToOne @JoinColumn(name = "data_provider_organisation_id")
    private DataProviderOrganisation dataProviderOrganisation;

    // Utilisateur qui a créé ce dataset
    @ManyToOne @JoinColumn(name = "data_provider_user_id")
    private DataProviderOrganisationMember dataProviderOrganisationMember;

}
