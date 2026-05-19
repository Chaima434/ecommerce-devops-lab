package com.finance.repository;

import com.finance.model.AlerteBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlerteBudgetRepository extends JpaRepository<AlerteBudget, Long> {
    List<AlerteBudget> findByBudgetId(Long budgetId);
}
