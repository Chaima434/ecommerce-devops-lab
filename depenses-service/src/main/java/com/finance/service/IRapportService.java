package com.finance.service;

import com.finance.dto.RapportRequestDTO;
import com.finance.dto.RapportResponseDTO;
import java.util.List;

/**
 * Interface du service Rapport.
 */
public interface IRapportService {
    List<RapportResponseDTO> findByUtilisateur(Long utilisateurId);
    RapportResponseDTO findById(Long id);
    RapportResponseDTO create(RapportRequestDTO dto);
    void delete(Long id);
}
