package com.finance.service.impl;

import com.finance.dto.RapportRequestDTO;
import com.finance.dto.RapportResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Rapport;
import com.finance.model.Utilisateur;
import com.finance.repository.RapportRepository;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.IRapportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RapportServiceImpl implements IRapportService {

    @Autowired private RapportRepository rapportRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;

    @Override
    public List<RapportResponseDTO> findByUtilisateur(Long utilisateurId) {
        return rapportRepository.findByUtilisateurId(utilisateurId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public RapportResponseDTO findById(Long id) { return toDTO(getOrThrow(id)); }

    @Override
    public RapportResponseDTO create(RapportRequestDTO dto) {
        Utilisateur u = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Rapport entity = new Rapport();
        entity.setType(dto.getType());
        entity.setPeriode(dto.getPeriode());
        entity.setFormat(dto.getFormat());
        entity.setDateGeneration(new Date());
        entity.setUtilisateur(u);
        return toDTO(rapportRepository.save(entity));
    }

    @Override
    public void delete(Long id) { getOrThrow(id); rapportRepository.deleteById(id); }

    private Rapport getOrThrow(Long id) {
        return rapportRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé : " + id));
    }

    private RapportResponseDTO toDTO(Rapport r) {
        return RapportResponseDTO.builder()
                .id(r.getId()).type(r.getType()).periode(r.getPeriode())
                .dateGeneration(r.getDateGeneration()).format(r.getFormat())
                .utilisateurId(r.getUtilisateur() != null ? r.getUtilisateur().getId() : null).build();
    }
}
