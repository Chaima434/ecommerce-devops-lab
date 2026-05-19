package com.finance.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO de réponse pour Prévision, avec excédent calculé.
 */
@Data
@Builder
public class PrevisionResponseDTO {
    private Long id;
    private Integer mois;
    private Integer annee;
    private Double revenuPrevu;
    private Double depensesPrevues;
    private Long utilisateurId;
    // Calculé par le service
    private Double excedent;
    private Boolean enDeficit;
}
