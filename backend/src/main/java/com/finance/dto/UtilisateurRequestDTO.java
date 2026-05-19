package com.finance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Date;

/**
 * DTO pour la création/mise à jour d'un Utilisateur.
 * Sépare le modèle JPA du contrat API (couplage faible).
 */
@Data
public class UtilisateurRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Email(message = "Format email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;
}
