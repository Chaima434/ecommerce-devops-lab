package com.finance.service;

import com.finance.dto.ObjectifEpargneRequestDTO;
import com.finance.dto.ObjectifEpargneResponseDTO;
import java.util.List;

/**
 * Interface du service ObjectifEpargne.
 */
public interface IObjectifEpargneService {
    List<ObjectifEpargneResponseDTO> findByUtilisateur(Long utilisateurId);
    ObjectifEpargneResponseDTO findById(Long id);
    ObjectifEpargneResponseDTO create(ObjectifEpargneRequestDTO dto);
    ObjectifEpargneResponseDTO update(Long id, ObjectifEpargneRequestDTO dto);
    void delete(Long id);
}
