package com.finance.dto;

import com.finance.model.TypeTransaction;
import lombok.Builder;
import lombok.Data;
import java.util.Date;

/**
 * DTO de réponse pour Transaction.
 */
@Data
@Builder
public class TransactionResponseDTO {
    private Long id;
    private Double montant;
    private Date date;
    private TypeTransaction type;
    private String description;
    private String source;
    private Long utilisateurId;
    private String utilisateurNom;
    private Long categorieId;
    private String categorieNom;
}
