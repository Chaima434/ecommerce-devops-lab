package com.finance.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO pour créer ou modifier un Budget.
 */
@Data
public class BudgetRequestDTO {

    @NotNull(message = "Le montant alloué est obligatoire")
    @Positive(message = "Le montant alloué doit être positif")
    private Double montantAlloue;

    private Double montantDepense = 0.0;

    @NotNull(message = "Le mois est obligatoire")
    private Integer mois;

    @NotNull(message = "L'année est obligatoire")
    private Integer annee;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categorieId;

    @NotNull(message = "L'utilisateur est obligatoire")
    private Long utilisateurId;
}
