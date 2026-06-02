package com.finance.controller;

import com.finance.dto.PretRequestDTO;
import com.finance.dto.PretResponseDTO;
import com.finance.service.IPretService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prets")
public class PretController {

    @Autowired
    private IPretService pretService;

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<PretResponseDTO>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(pretService.findByUtilisateur(utilisateurId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PretResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(pretService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PretResponseDTO> create(@Valid @RequestBody PretRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pretService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PretResponseDTO> update(@PathVariable Long id,
                                                   @Valid @RequestBody PretRequestDTO dto) {
        return ResponseEntity.ok(pretService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pretService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
