package com.finance.service;

import com.finance.dto.BudgetRequestDTO;
import com.finance.dto.BudgetResponseDTO;
import java.util.List;

/**
 * Interface du service Budget.
 */
public interface IBudgetService {
    List<BudgetResponseDTO> findAll();
    List<BudgetResponseDTO> findByUtilisateur(Long utilisateurId);
    BudgetResponseDTO findById(Long id);
    BudgetResponseDTO create(BudgetRequestDTO dto);
    BudgetResponseDTO update(Long id, BudgetRequestDTO dto);
    void delete(Long id);
}
