package com.finance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO pour créer ou modifier une Catégorie.
 */
@Data
public class CategorieRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String type;
    private String couleur;
    private Boolean personnalisee;
}
