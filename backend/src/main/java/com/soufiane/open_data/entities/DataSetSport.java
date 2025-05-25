package com.soufiane.open_data.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity @Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DataSetSport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomEvenement;
    private String description;
    private String theme;
    private LocalDate datePublication;
    private String typeSport;
    private String localisation;
    private String participants;
    private String resultat;
    private Long gid;

    private boolean deleted = false;

}
