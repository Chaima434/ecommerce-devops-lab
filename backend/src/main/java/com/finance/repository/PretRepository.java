package com.finance.repository;

import com.finance.model.Pret;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PretRepository extends JpaRepository<Pret, Long> {
    List<Pret> findByUtilisateurId(Long utilisateurId);
}
