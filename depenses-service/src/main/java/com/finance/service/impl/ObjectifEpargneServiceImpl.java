package com.finance.service.impl;

import com.finance.dto.ObjectifEpargneRequestDTO;
import com.finance.dto.ObjectifEpargneResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.ObjectifEpargne;
import com.finance.model.Utilisateur;
import com.finance.repository.ObjectifEpargneRepository;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.IObjectifEpargneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ObjectifEpargneServiceImpl implements IObjectifEpargneService {

    @Autowired private ObjectifEpargneRepository objectifRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;

    @Override
    public List<ObjectifEpargneResponseDTO> findByUtilisateur(Long utilisateurId) {
        return objectifRepository.findByUtilisateurId(utilisateurId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public ObjectifEpargneResponseDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    public ObjectifEpargneResponseDTO create(ObjectifEpargneRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        ObjectifEpargne entity = new ObjectifEpargne();
        entity.setIntitule(dto.getIntitule());
        entity.setMontantCible(dto.getMontantCible());
        entity.setMontantActuel(dto.getMontantActuel() != null ? dto.getMontantActuel() : 0.0);
        entity.setDateEcheance(dto.getDateEcheance());
        entity.setPriorite(dto.getPriorite() != null ? dto.getPriorite() : 1);
        entity.setUtilisateur(utilisateur);
        return toDTO(objectifRepository.save(entity));
    }

    @Override
    public ObjectifEpargneResponseDTO update(Long id, ObjectifEpargneRequestDTO dto) {
        ObjectifEpargne entity = getOrThrow(id);
        entity.setIntitule(dto.getIntitule());
        entity.setMontantCible(dto.getMontantCible());
        entity.setMontantActuel(dto.getMontantActuel());
        entity.setDateEcheance(dto.getDateEcheance());
        entity.setPriorite(dto.getPriorite());
        return toDTO(objectifRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        getOrThrow(id);
        objectifRepository.deleteById(id);
    }

    // ─── Helpers ─────────────────────────────────────────
    private ObjectifEpargne getOrThrow(Long id) {
        return objectifRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Objectif d'épargne non trouvé avec l'id : " + id));
    }

    private ObjectifEpargneResponseDTO toDTO(ObjectifEpargne o) {
        double progres = (o.getMontantCible() != null && o.getMontantCible() > 0)
                ? (o.getMontantActuel() / o.getMontantCible()) * 100 : 0;
        return ObjectifEpargneResponseDTO.builder()
                .id(o.getId())
                .intitule(o.getIntitule())
                .montantCible(o.getMontantCible())
                .montantActuel(o.getMontantActuel())
                .dateEcheance(o.getDateEcheance())
                .priorite(o.getPriorite())
                .utilisateurId(o.getUtilisateur() != null ? o.getUtilisateur().getId() : null)
                .progresPercent(Math.min(progres, 100))
                .estAtteint(o.getMontantActuel() >= o.getMontantCible())
                .build();
    }
}
