package com.finance.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Date;

/**
 * DTO de réponse pour Prêt, avec mensualité calculée.
 */
@Data
@Builder
public class PretResponseDTO {
    private Long id;
    private String typePret;
    private Double montantTotal;
    private Double capitalRestant;
    private Double tauxInteret;
    private Date dateEcheance;
    private Long utilisateurId;
    // Calculé par le service
    private Double mensualiteEstimee;
}
