package com.soufiane.open_data.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity @Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DataProviderOrganisation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private UUID uuid;
    private String name;
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
//    @OneToMany(mappedBy = "dataProviderOrganisation")
//    private List<DataProviderOrganisationMember> dataProviderOrganisationMembers = new ArrayList<>();
    @OneToMany(mappedBy = "dataProviderOrganisation")
    private List<DataSet> dataSets;
    @Lob @Column(columnDefinition = "LONGBLOB")
    private byte[] iconData;
    private String iconPath;
    private String icon;
}
