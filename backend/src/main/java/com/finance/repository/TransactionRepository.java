package com.finance.repository;

import com.finance.model.Transaction;
import com.finance.model.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUtilisateurId(Long utilisateurId);
    List<Transaction> findByUtilisateurIdAndType(Long utilisateurId, TypeTransaction type);
}
