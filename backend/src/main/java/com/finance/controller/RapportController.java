package com.finance.controller;

import com.finance.dto.RapportRequestDTO;
import com.finance.dto.RapportResponseDTO;
import com.finance.service.IRapportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {

    @Autowired
    private IRapportService rapportService;

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<RapportResponseDTO>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(rapportService.findByUtilisateur(utilisateurId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RapportResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rapportService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RapportResponseDTO> create(@Valid @RequestBody RapportRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rapportService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rapportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
