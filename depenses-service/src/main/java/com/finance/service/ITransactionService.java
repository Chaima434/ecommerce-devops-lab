package com.finance.service;

import com.finance.dto.TransactionRequestDTO;
import com.finance.dto.TransactionResponseDTO;
import com.finance.model.TypeTransaction;
import java.util.List;

/**
 * Interface du service Transaction.
 */
public interface ITransactionService {
    List<TransactionResponseDTO> findAll();
    List<TransactionResponseDTO> findByUtilisateur(Long utilisateurId);
    List<TransactionResponseDTO> findByUtilisateurAndType(Long utilisateurId, TypeTransaction type);
    TransactionResponseDTO findById(Long id);
    TransactionResponseDTO create(TransactionRequestDTO dto);
    TransactionResponseDTO update(Long id, TransactionRequestDTO dto);
    void delete(Long id);
    Double sumByUtilisateurAndType(Long utilisateurId, TypeTransaction type);
}
