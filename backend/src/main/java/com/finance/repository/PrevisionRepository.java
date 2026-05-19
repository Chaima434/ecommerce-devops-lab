package com.finance.repository;

import com.finance.model.Prevision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrevisionRepository extends JpaRepository<Prevision, Long> {
    List<Prevision> findByUtilisateurId(Long utilisateurId);
}
