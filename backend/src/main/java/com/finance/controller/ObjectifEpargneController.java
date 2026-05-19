package com.finance.controller;

import com.finance.dto.ObjectifEpargneRequestDTO;
import com.finance.dto.ObjectifEpargneResponseDTO;
import com.finance.service.IObjectifEpargneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/objectifs-epargne")
public class ObjectifEpargneController {

    @Autowired
    private IObjectifEpargneService objectifService;

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<ObjectifEpargneResponseDTO>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(objectifService.findByUtilisateur(utilisateurId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObjectifEpargneResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(objectifService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ObjectifEpargneResponseDTO> create(@Valid @RequestBody ObjectifEpargneRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(objectifService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ObjectifEpargneResponseDTO> update(@PathVariable Long id,
                                                              @Valid @RequestBody ObjectifEpargneRequestDTO dto) {
        return ResponseEntity.ok(objectifService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        objectifService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
