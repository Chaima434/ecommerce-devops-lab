package com.finance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montantAlloue;
    private Double montantDepense;
    private Integer mois;
    private Integer annee;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL)
    private List<AlerteBudget> alertes;

    public Double calculerSolde() {
        return montantAlloue - montantDepense;
    }

    public Boolean verifierDepassement() {
        return montantDepense > montantAlloue;
    }

    public void suiviTempsReel() {
        // Logique de suivi
    }
}
