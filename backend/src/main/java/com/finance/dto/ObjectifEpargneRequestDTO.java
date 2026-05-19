package com.finance.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.Date;

/**
 * DTO pour créer ou modifier un Objectif d'Épargne.
 */
@Data
public class ObjectifEpargneRequestDTO {

    @NotNull(message = "L'intitulé est obligatoire")
    private String intitule;

    @Positive(message = "Le montant cible doit être positif")
    private Double montantCible;

    private Double montantActuel = 0.0;
    private Date dateEcheance;
    private Integer priorite = 1;

    @NotNull(message = "L'utilisateur est obligatoire")
    private Long utilisateurId;
}
