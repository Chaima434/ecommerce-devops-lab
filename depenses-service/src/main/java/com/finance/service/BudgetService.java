package com.finance.service;

import com.finance.model.Budget;
import com.finance.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public List<Budget> getBudgetsByUtilisateur(Long utilisateurId) {
        return budgetRepository.findByUtilisateurId(utilisateurId);
    }

    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }
}
