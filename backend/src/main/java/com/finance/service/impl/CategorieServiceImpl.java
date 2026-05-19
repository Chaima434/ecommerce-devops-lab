package com.finance.service.impl;

import com.finance.dto.CategorieRequestDTO;
import com.finance.dto.CategorieResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Categorie;
import com.finance.repository.CategorieRepository;
import com.finance.service.ICategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategorieServiceImpl implements ICategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    @Override
    public List<CategorieResponseDTO> findAll() {
        return categorieRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public CategorieResponseDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    public CategorieResponseDTO create(CategorieRequestDTO dto) {
        Categorie entity = new Categorie();
        entity.setNom(dto.getNom());
        entity.setType(dto.getType());
        entity.setCouleur(dto.getCouleur());
        entity.setPersonnalisee(dto.getPersonnalisee() != null ? dto.getPersonnalisee() : false);
        return toDTO(categorieRepository.save(entity));
    }

    @Override
    public CategorieResponseDTO update(Long id, CategorieRequestDTO dto) {
        Categorie entity = getOrThrow(id);
        entity.setNom(dto.getNom());
        entity.setType(dto.getType());
        entity.setCouleur(dto.getCouleur());
        entity.setPersonnalisee(dto.getPersonnalisee());
        return toDTO(categorieRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        getOrThrow(id);
        categorieRepository.deleteById(id);
    }

    // ─── Helpers ─────────────────────────────────────────
    private Categorie getOrThrow(Long id) {
        return categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée avec l'id : " + id));
    }

    public CategorieResponseDTO toDTO(Categorie c) {
        return CategorieResponseDTO.builder()
                .id(c.getId())
                .nom(c.getNom())
                .type(c.getType())
                .couleur(c.getCouleur())
                .personnalisee(c.getPersonnalisee())
                .build();
    }
}
