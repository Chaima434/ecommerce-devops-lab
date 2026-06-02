package com.finance.service.impl;

import com.finance.dto.UtilisateurRequestDTO;
import com.finance.dto.UtilisateurResponseDTO;
import com.finance.exception.ResourceNotFoundException;
import com.finance.model.Utilisateur;
import com.finance.repository.UtilisateurRepository;
import com.finance.service.IUtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurServiceImpl implements IUtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));
        
        return new User(user.getEmail(), user.getMotDePasse(), new ArrayList<>());
    }

    @Override
    public UtilisateurResponseDTO getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur authentifié non trouvé"));
        return toDTO(user);
    }

    @Override
    public List<UtilisateurResponseDTO> findAll() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UtilisateurResponseDTO findById(Long id) {
        return toDTO(getOrThrow(id));
    }

    @Override
    public UtilisateurResponseDTO create(UtilisateurRequestDTO dto) {
        Utilisateur entity = new Utilisateur();
        entity.setNom(dto.getNom());
        entity.setEmail(dto.getEmail());
        entity.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        entity.setDateInscription(new Date());
        return toDTO(utilisateurRepository.save(entity));
    }

    @Override
    public UtilisateurResponseDTO update(Long id, UtilisateurRequestDTO dto) {
        Utilisateur entity = getOrThrow(id);
        entity.setNom(dto.getNom());
        entity.setEmail(dto.getEmail());
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isBlank()) {
            entity.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }
        return toDTO(utilisateurRepository.save(entity));
    }

    @Override
    public void delete(Long id) {
        getOrThrow(id);
        utilisateurRepository.deleteById(id);
    }

    // ─── Helpers ─────────────────────────────────────────
    private Utilisateur getOrThrow(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id : " + id));
    }

    private UtilisateurResponseDTO toDTO(Utilisateur u) {
        return UtilisateurResponseDTO.builder()
                .id(u.getId())
                .nom(u.getNom())
                .email(u.getEmail())
                .dateInscription(u.getDateInscription())
                .build();
    }
}
