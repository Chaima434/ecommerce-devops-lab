package com.finance.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO de réponse pour Budget, avec les métriques calculées.
 */
@Data
@Builder
public class BudgetResponseDTO {
    private Long id;
    private Double montantAlloue;
    private Double montantDepense;
    private Integer mois;
    private Integer annee;
    private Long categorieId;
    private String categorieNom;
    private Long utilisateurId;
    // Calculés par le service
    private Double solde;
    private Boolean depassement;
    private Double pourcentageConsomme;
}
