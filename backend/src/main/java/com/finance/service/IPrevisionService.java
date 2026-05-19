package com.finance.service;

import com.finance.dto.PrevisionRequestDTO;
import com.finance.dto.PrevisionResponseDTO;
import java.util.List;

/**
 * Interface du service Prévision.
 */
public interface IPrevisionService {
    List<PrevisionResponseDTO> findByUtilisateur(Long utilisateurId);
    PrevisionResponseDTO findById(Long id);
    PrevisionResponseDTO create(PrevisionRequestDTO dto);
    PrevisionResponseDTO update(Long id, PrevisionRequestDTO dto);
    void delete(Long id);
}
