package com.soufiane.open_data.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DataSetFinance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String anneeBudgetaire;
    private String nomBeneficiaire;
    private String numeroSiret;
    private String objetDossier;
    private Double montantVote;
    private String direction;
    private String natureSubvention;
    private Long gid;
    private boolean deleted = false;
}
