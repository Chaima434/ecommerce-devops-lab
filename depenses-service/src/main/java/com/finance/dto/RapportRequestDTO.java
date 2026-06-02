package com.finance.dto;

import com.finance.model.TypeRapport;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO pour déclencher la génération d'un Rapport.
 */
@Data
public class RapportRequestDTO {

    @NotNull(message = "Le type de rapport est obligatoire")
    private TypeRapport type;

    private String periode;
    private String format = "PDF";

    @NotNull(message = "L'utilisateur est obligatoire")
    private Long utilisateurId;
}
