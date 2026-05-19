package com.finance.service.impl;

import com.finance.dto.PrevisionRequestDTO;
import com.finance.dto.PrevisionResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Prevision;
import com.finance.model.Utilisateur;
import com.finance.repository.PrevisionRepository;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.IPrevisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrevisionServiceImpl implements IPrevisionService {

    @Autowired private PrevisionRepository previsionRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;

    @Override
    public List<PrevisionResponseDTO> findByUtilisateur(Long utilisateurId) {
        return previsionRepository.findByUtilisateurId(utilisateurId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public PrevisionResponseDTO findById(Long id) { return toDTO(getOrThrow(id)); }

    @Override
    public PrevisionResponseDTO create(PrevisionRequestDTO dto) {
        Utilisateur u = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Prevision entity = new Prevision();
        entity.setMois(dto.getMois());
        entity.setAnnee(dto.getAnnee());
        entity.setRevenuPrevu(dto.getRevenuPrevu());
        entity.setDepensesPrevues(dto.getDepensesPrevues());
        entity.setExcedent(dto.getRevenuPrevu() - dto.getDepensesPrevues());
        entity.setUtilisateur(u);
        return toDTO(previsionRepository.save(entity));
    }

    @Override
    public PrevisionResponseDTO update(Long id, PrevisionRequestDTO dto) {
        Prevision entity = getOrThrow(id);
        entity.setMois(dto.getMois());
        entity.setAnnee(dto.getAnnee());
        entity.setRevenuPrevu(dto.getRevenuPrevu());
        entity.setDepensesPrevues(dto.getDepensesPrevues());
        entity.setExcedent(dto.getRevenuPrevu() - dto.getDepensesPrevues());
        return toDTO(previsionRepository.save(entity));
    }

    @Override
    public void delete(Long id) { getOrThrow(id); previsionRepository.deleteById(id); }

    private Prevision getOrThrow(Long id) {
        return previsionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prévision non trouvée : " + id));
    }

    private PrevisionResponseDTO toDTO(Prevision p) {
        double excedent = (p.getRevenuPrevu() != null ? p.getRevenuPrevu() : 0)
                        - (p.getDepensesPrevues() != null ? p.getDepensesPrevues() : 0);
        return PrevisionResponseDTO.builder()
                .id(p.getId()).mois(p.getMois()).annee(p.getAnnee())
                .revenuPrevu(p.getRevenuPrevu()).depensesPrevues(p.getDepensesPrevues())
                .utilisateurId(p.getUtilisateur() != null ? p.getUtilisateur().getId() : null)
                .excedent(excedent).enDeficit(excedent < 0).build();
    }
}
