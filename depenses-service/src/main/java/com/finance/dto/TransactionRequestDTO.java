package com.finance.dto;

import com.finance.model.TypeTransaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.Date;

/**
 * DTO pour créer ou modifier une Transaction.
 */
@Data
public class TransactionRequestDTO {

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private Double montant;

    private Date date;

    @NotNull(message = "Le type de transaction est obligatoire")
    private TypeTransaction type;

    private String description;
    private String source;

    @NotNull(message = "L'utilisateur est obligatoire")
    private Long utilisateurId;

    private Long categorieId;
}
