package com.finance.service;

import com.finance.dto.UtilisateurRequestDTO;
import com.finance.dto.UtilisateurResponseDTO;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;

/**
 * Interface du service Utilisateur.
 * Étend UserDetailsService pour l'intégration Spring Security.
 */
public interface IUtilisateurService extends UserDetailsService {
    List<UtilisateurResponseDTO> findAll();
    UtilisateurResponseDTO findById(Long id);
    UtilisateurResponseDTO create(UtilisateurRequestDTO dto);
    UtilisateurResponseDTO update(Long id, UtilisateurRequestDTO dto);
    void delete(Long id);
    
    /**
     * Récupère l'utilisateur actuellement authentifié via le SecurityContext.
     */
    UtilisateurResponseDTO getAuthenticatedUser();
}
