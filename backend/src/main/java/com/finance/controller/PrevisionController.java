package com.finance.controller;

import com.finance.dto.PrevisionRequestDTO;
import com.finance.dto.PrevisionResponseDTO;
import com.finance.service.IPrevisionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/previsions")
public class PrevisionController {

    @Autowired
    private IPrevisionService previsionService;

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<PrevisionResponseDTO>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(previsionService.findByUtilisateur(utilisateurId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrevisionResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(previsionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PrevisionResponseDTO> create(@Valid @RequestBody PrevisionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(previsionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrevisionResponseDTO> update(@PathVariable Long id,
                                                        @Valid @RequestBody PrevisionRequestDTO dto) {
        return ResponseEntity.ok(previsionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        previsionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
