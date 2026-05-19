package com.finance.service.impl;

import com.finance.dto.BudgetRequestDTO;
import com.finance.dto.BudgetResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Budget;
import com.finance.model.Categorie;
import com.finance.model.Utilisateur;
import com.finance.repository.BudgetRepository;
import com.finance.repository.CategorieRepository;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.IBudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetServiceImpl implements IBudgetService {

    @Autowired private BudgetRepository budgetRepository;
    @Autowired private UtilisateurRepository utilisateurRepository;
    @Autowired private CategorieRepository categorieRepository;

    @Override
    public List<BudgetResponseDTO> findAll() {
        return budgetRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BudgetResponseDTO> findByUtilisateur(Long utilisateurId) {
        return budgetRepository.findByUtilisateurId(utilisateurId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public BudgetResponseDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    public BudgetResponseDTO create(BudgetRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée"));

        Budget entity = new Budget();
        entity.setMontantAlloue(dto.getMontantAlloue());
        entity.setMontantDepense(dto.getMontantDepense() != null ? dto.getMontantDepense() : 0.0);
        entity.setMois(dto.getMois());
        entity.setAnnee(dto.getAnnee());
        entity.setCategorie(categorie);
        entity.setUtilisateur(utilisateur);
        return toDTO(budgetRepository.save(entity));
    }

    @Override
    public BudgetResponseDTO update(Long id, BudgetRequestDTO dto) {
        Budget entity = getOrThrow(id);
        entity.setMontantAlloue(dto.getMontantAlloue());
        entity.setMontantDepense(dto.getMontantDepense() != null ? dto.getMontantDepense() : entity.getMontantDepense());
        entity.setMois(dto.getMois());
        entity.setAnnee(dto.getAnnee());
        if (dto.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée"));
            entity.setCategorie(categorie);
        }
        return toDTO(budgetRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        getOrThrow(id);
        budgetRepository.deleteById(id);
    }

    // ─── Helpers ─────────────────────────────────────────
    private Budget getOrThrow(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé avec l'id : " + id));
    }

    private BudgetResponseDTO toDTO(Budget b) {
        double solde = b.getMontantAlloue() - b.getMontantDepense();
        double pourcent = b.getMontantAlloue() > 0
                ? (b.getMontantDepense() / b.getMontantAlloue()) * 100 : 0;
        return BudgetResponseDTO.builder()
                .id(b.getId())
                .montantAlloue(b.getMontantAlloue())
                .montantDepense(b.getMontantDepense())
                .mois(b.getMois())
                .annee(b.getAnnee())
                .categorieId(b.getCategorie() != null ? b.getCategorie().getId() : null)
                .categorieNom(b.getCategorie() != null ? b.getCategorie().getNom() : null)
                .utilisateurId(b.getUtilisateur() != null ? b.getUtilisateur().getId() : null)
                .solde(solde)
                .depassement(b.getMontantDepense() > b.getMontantAlloue())
                .pourcentageConsomme(Math.min(pourcent, 100))
                .build();
    }
}
