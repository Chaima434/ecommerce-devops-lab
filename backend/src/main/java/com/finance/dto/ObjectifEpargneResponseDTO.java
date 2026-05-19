package com.finance.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Date;

/**
 * DTO de réponse pour Objectif d'Épargne, avec progression calculée.
 */
@Data
@Builder
public class ObjectifEpargneResponseDTO {
    private Long id;
    private String intitule;
    private Double montantCible;
    private Double montantActuel;
    private Date dateEcheance;
    private Integer priorite;
    private Long utilisateurId;
    // Calculés par le service
    private Double progresPercent;
    private Boolean estAtteint;
}
