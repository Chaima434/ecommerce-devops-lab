package com.finance.service.impl;

import com.finance.dto.PretRequestDTO;
import com.finance.dto.PretResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Pret;
import com.finance.model.Utilisateur;
import com.finance.repository.PretRepository;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.IPretService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PretServiceImpl implements IPretService {

    @Autowired private PretRepository pretRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;

    @Override
    public List<PretResponseDTO> findByUtilisateur(Long utilisateurId) {
        return pretRepository.findByUtilisateurId(utilisateurId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public PretResponseDTO findById(Long id) { return toDTO(getOrThrow(id)); }

    @Override
    public PretResponseDTO create(PretRequestDTO dto) {
        Utilisateur u = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Pret entity = new Pret();
        entity.setTypePret(dto.getTypePret());
        entity.setMontantTotal(dto.getMontantTotal());
        entity.setCapitalRestant(dto.getCapitalRestant() != null ? dto.getCapitalRestant() : dto.getMontantTotal());
        entity.setTauxInteret(dto.getTauxInteret());
        entity.setDateEcheance(dto.getDateEcheance());
        entity.setUtilisateur(u);
        return toDTO(pretRepository.save(entity));
    }

    @Override
    public PretResponseDTO update(Long id, PretRequestDTO dto) {
        Pret entity = getOrThrow(id);
        entity.setTypePret(dto.getTypePret());
        entity.setMontantTotal(dto.getMontantTotal());
        entity.setCapitalRestant(dto.getCapitalRestant());
        entity.setTauxInteret(dto.getTauxInteret());
        entity.setDateEcheance(dto.getDateEcheance());
        return toDTO(pretRepository.save(entity));
    }

    @Override
    public void delete(Long id) { getOrThrow(id); pretRepository.deleteById(id); }

    private Pret getOrThrow(Long id) {
        return pretRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Prêt non trouvé : " + id));
    }

    private Double calculerMensualite(Pret p) {
        if (p.getCapitalRestant() == null || p.getTauxInteret() == null || p.getDateEcheance() == null) return 0.0;
        double tauxM = p.getTauxInteret() / 100.0 / 12;
        long mois = (p.getDateEcheance().getTime() - System.currentTimeMillis()) / (1000L * 60 * 60 * 24 * 30);
        if (mois <= 0) return p.getCapitalRestant();
        if (tauxM == 0) return p.getCapitalRestant() / mois;
        return p.getCapitalRestant() * tauxM / (1 - Math.pow(1 + tauxM, -mois));
    }

    private PretResponseDTO toDTO(Pret p) {
        return PretResponseDTO.builder()
                .id(p.getId()).typePret(p.getTypePret()).montantTotal(p.getMontantTotal())
                .capitalRestant(p.getCapitalRestant()).tauxInteret(p.getTauxInteret())
                .dateEcheance(p.getDateEcheance())
                .utilisateurId(p.getUtilisateur() != null ? p.getUtilisateur().getId() : null)
                .mensualiteEstimee(calculerMensualite(p)).build();
    }
}
