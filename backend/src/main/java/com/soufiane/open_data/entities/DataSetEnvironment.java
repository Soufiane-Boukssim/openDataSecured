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
public class DataSetEnvironment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomDeLaDonnee;
    private String description;
    private String theme;
    private LocalDate dateDePublication;
    private String uniteDeMesure;
    private Double valeur;
    private String lieu;
    private String source;
    private Long gid;
    private boolean deleted = false;
}
