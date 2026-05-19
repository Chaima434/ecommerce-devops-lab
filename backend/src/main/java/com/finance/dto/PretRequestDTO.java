package com.finance.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.Date;

/**
 * DTO pour créer ou modifier un Prêt.
 */
@Data
public class PretRequestDTO {

    @NotNull(message = "Le type de prêt est obligatoire")
    private String typePret;

    @Positive(message = "Le montant total doit être positif")
    private Double montantTotal;

    private Double capitalRestant;

    @Positive(message = "Le taux d'intérêt doit être positif")
    private Double tauxInteret;

    private Date dateEcheance;

    @NotNull(message = "L'utilisateur est obligatoire")
    private Long utilisateurId;
}
