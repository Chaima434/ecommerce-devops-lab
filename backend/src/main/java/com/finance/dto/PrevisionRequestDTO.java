package com.finance.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO pour créer ou modifier une Prévision.
 */
@Data
public class PrevisionRequestDTO {

    @NotNull(message = "Le mois est obligatoire")
    private Integer mois;

    @NotNull(message = "L'année est obligatoire")
    private Integer annee;

    private Double revenuPrevu = 0.0;
    private Double depensesPrevues = 0.0;

    @NotNull(message = "L'utilisateur est obligatoire")
    private Long utilisateurId;
}
