package com.finance.controller;

import com.finance.config.JwtUtils;
import com.finance.dto.AuthRequestDTO;
import com.finance.dto.AuthResponseDTO;
import com.finance.dto.UtilisateurRequestDTO;
import com.finance.dto.UtilisateurResponseDTO;
import com.finance.service.IUtilisateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private IUtilisateurService utilisateurService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = utilisateurService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtils.generateToken(userDetails);
        
        UtilisateurResponseDTO userDTO = utilisateurService.findAll().stream()
                .filter(u -> u.getEmail().equals(request.getEmail()))
                .findFirst()
                .orElse(null);

        return ResponseEntity.ok(AuthResponseDTO.builder()
                .token(jwt)
                .user(userDTO)
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<UtilisateurResponseDTO> register(@Valid @RequestBody UtilisateurRequestDTO dto) {
        return ResponseEntity.ok(utilisateurService.create(dto));
    }
    
    @GetMapping("/me")
    public ResponseEntity<UtilisateurResponseDTO> getMe() {
        return ResponseEntity.ok(utilisateurService.getAuthenticatedUser());
    }
}
