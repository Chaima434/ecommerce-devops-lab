package com.finance.controller;

import com.finance.dto.BudgetRequestDTO;
import com.finance.dto.BudgetResponseDTO;
import com.finance.service.IBudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private IBudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getAll() {
        return ResponseEntity.ok(budgetService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.findById(id));
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<BudgetResponseDTO>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(budgetService.findByUtilisateur(utilisateurId));
    }

    @PostMapping
    public ResponseEntity<BudgetResponseDTO> create(@Valid @RequestBody BudgetRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody BudgetRequestDTO dto) {
        return ResponseEntity.ok(budgetService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
