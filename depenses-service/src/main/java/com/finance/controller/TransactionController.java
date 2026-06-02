package com.finance.controller;

import com.finance.dto.TransactionRequestDTO;
import com.finance.dto.TransactionResponseDTO;
import com.finance.model.TypeTransaction;
import com.finance.service.ITransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private ITransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getAll() {
        return ResponseEntity.ok(transactionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.findById(id));
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<TransactionResponseDTO>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(transactionService.findByUtilisateur(utilisateurId));
    }

    @GetMapping("/utilisateur/{utilisateurId}/type/{type}")
    public ResponseEntity<List<TransactionResponseDTO>> getByUtilisateurAndType(
            @PathVariable Long utilisateurId, @PathVariable TypeTransaction type) {
        return ResponseEntity.ok(transactionService.findByUtilisateurAndType(utilisateurId, type));
    }

    @GetMapping("/utilisateur/{utilisateurId}/solde")
    public ResponseEntity<Map<String, Double>> getSolde(@PathVariable Long utilisateurId) {
        double revenus = transactionService.sumByUtilisateurAndType(utilisateurId, TypeTransaction.REVENU);
        double depenses = transactionService.sumByUtilisateurAndType(utilisateurId, TypeTransaction.DEPENSE);
        return ResponseEntity.ok(Map.of(
                "revenus", revenus,
                "depenses", depenses,
                "solde", revenus - depenses
        ));
    }

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> create(@Valid @RequestBody TransactionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> update(@PathVariable Long id,
                                                          @Valid @RequestBody TransactionRequestDTO dto) {
        return ResponseEntity.ok(transactionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
