package com.finance.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO de réponse pour Catégorie.
 */
@Data
@Builder
public class CategorieResponseDTO {
    private Long id;
    private String nom;
    private String type;
    private String couleur;
    private Boolean personnalisee;
}
