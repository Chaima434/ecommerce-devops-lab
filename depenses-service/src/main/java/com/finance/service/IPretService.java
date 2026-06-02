package com.finance.service;

import com.finance.dto.PretRequestDTO;
import com.finance.dto.PretResponseDTO;
import java.util.List;

/**
 * Interface du service Prêt.
 */
public interface IPretService {
    List<PretResponseDTO> findByUtilisateur(Long utilisateurId);
    PretResponseDTO findById(Long id);
    PretResponseDTO create(PretRequestDTO dto);
    PretResponseDTO update(Long id, PretRequestDTO dto);
    void delete(Long id);
}
