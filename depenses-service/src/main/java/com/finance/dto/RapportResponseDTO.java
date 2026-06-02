package com.finance.dto;

import com.finance.model.TypeRapport;
import lombok.Builder;
import lombok.Data;
import java.util.Date;

/**
 * DTO de réponse pour Rapport.
 */
@Data
@Builder
public class RapportResponseDTO {
    private Long id;
    private TypeRapport type;
    private String periode;
    private Date dateGeneration;
    private String format;
    private Long utilisateurId;
}
