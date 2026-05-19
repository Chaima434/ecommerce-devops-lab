package com.finance.controller;

import com.finance.dto.CategorieRequestDTO;
import com.finance.dto.CategorieResponseDTO;
import com.finance.service.ICategorieService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategorieController {

    @Autowired
    private ICategorieService categorieService;

    @GetMapping
    public ResponseEntity<List<CategorieResponseDTO>> getAll() {
        return ResponseEntity.ok(categorieService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categorieService.findById(id));
    }

    @PostMapping
    public ResponseEntity<CategorieResponseDTO> create(@Valid @RequestBody CategorieRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categorieService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategorieResponseDTO> update(@PathVariable Long id,
                                                        @Valid @RequestBody CategorieRequestDTO dto) {
        return ResponseEntity.ok(categorieService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categorieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
