package com.finance.service;

import com.finance.dto.CategorieRequestDTO;
import com.finance.dto.CategorieResponseDTO;
import java.util.List;

/**
 * Interface du service Catégorie.
 */
public interface ICategorieService {
    List<CategorieResponseDTO> findAll();
    CategorieResponseDTO findById(Long id);
    CategorieResponseDTO create(CategorieRequestDTO dto);
    CategorieResponseDTO update(Long id, CategorieRequestDTO dto);
    void delete(Long id);
}
