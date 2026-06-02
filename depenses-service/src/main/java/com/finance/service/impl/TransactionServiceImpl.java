package com.finance.service.impl;

import com.finance.dto.TransactionRequestDTO;
import com.finance.dto.TransactionResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Categorie;
import com.finance.model.Transaction;
import com.finance.model.TypeTransaction;
import com.finance.model.Utilisateur;
import com.finance.repository.CategorieRepository;
import com.finance.repository.TransactionRepository;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.ITransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements ITransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private CategorieRepository categorieRepository;

    @Override
    public List<TransactionResponseDTO> findAll() {
        return transactionRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponseDTO> findByUtilisateur(Long utilisateurId) {
        return transactionRepository.findByUtilisateurId(utilisateurId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<TransactionResponseDTO> findByUtilisateurAndType(Long utilisateurId, TypeTransaction type) {
        return transactionRepository.findByUtilisateurIdAndType(utilisateurId, type)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TransactionResponseDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    public TransactionResponseDTO create(TransactionRequestDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(dto.getUtilisateurId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        Categorie categorie = null;
        if (dto.getCategorieId() != null) {
            categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée"));
        }
        Transaction entity = new Transaction();
        entity.setMontant(dto.getMontant());
        entity.setDate(dto.getDate() != null ? dto.getDate() : new Date());
        entity.setType(dto.getType());
        entity.setDescription(dto.getDescription());
        entity.setSource(dto.getSource());
        entity.setUtilisateur(utilisateur);
        entity.setCategorie(categorie);
        return toDTO(transactionRepository.save(entity));
    }

    @Override
    public TransactionResponseDTO update(Long id, TransactionRequestDTO dto) {
        Transaction entity = getOrThrow(id);
        entity.setMontant(dto.getMontant());
        entity.setDate(dto.getDate() != null ? dto.getDate() : entity.getDate());
        entity.setType(dto.getType());
        entity.setDescription(dto.getDescription());
        entity.setSource(dto.getSource());
        if (dto.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie non trouvée"));
            entity.setCategorie(categorie);
        }
        return toDTO(transactionRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        getOrThrow(id);
        transactionRepository.deleteById(id);
    }

    @Override
    public Double sumByUtilisateurAndType(Long utilisateurId, TypeTransaction type) {
        return transactionRepository.findByUtilisateurIdAndType(utilisateurId, type)
                .stream().mapToDouble(Transaction::getMontant).sum();
    }

    // ─── Helpers ─────────────────────────────────────────
    private Transaction getOrThrow(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction non trouvée avec l'id : " + id));
    }

    private TransactionResponseDTO toDTO(Transaction t) {
        return TransactionResponseDTO.builder()
                .id(t.getId())
                .montant(t.getMontant())
                .date(t.getDate())
                .type(t.getType())
                .description(t.getDescription())
                .source(t.getSource())
                .utilisateurId(t.getUtilisateur() != null ? t.getUtilisateur().getId() : null)
                .utilisateurNom(t.getUtilisateur() != null ? t.getUtilisateur().getNom() : null)
                .categorieId(t.getCategorie() != null ? t.getCategorie().getId() : null)
                .categorieNom(t.getCategorie() != null ? t.getCategorie().getNom() : null)
                .build();
    }
}
