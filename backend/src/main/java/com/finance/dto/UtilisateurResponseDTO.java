package com.finance.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Date;

/**
 * DTO de réponse pour Utilisateur. Ne renvoie jamais le mot de passe.
 */
@Data
@Builder
public class UtilisateurResponseDTO {
    private Long id;
    private String nom;
    private String email;
    private Date dateInscription;
}
