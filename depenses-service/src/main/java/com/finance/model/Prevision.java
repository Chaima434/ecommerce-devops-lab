package com.finance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prevision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer mois;
    private Integer annee;
    private Double revenuPrevu;
    private Double depensesPrevues;
    private Double excedent;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public Double calculerExcedent() {
        this.excedent = (revenuPrevu != null ? revenuPrevu : 0.0) - (depensesPrevues != null ? depensesPrevues : 0.0);
        return this.excedent;
    }

    public void genererAlerte() {
        // Logique d'alerte si excedent < 0
    }
}
