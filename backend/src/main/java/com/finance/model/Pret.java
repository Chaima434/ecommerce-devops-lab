package com.finance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pret {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typePret;
    private Double montantTotal;
    private Double capitalRestant;
    private Double tauxInteret;

    @Temporal(TemporalType.DATE)
    private Date dateEcheance;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public Double calculerMensualite() {
        // Formule de mensualité
        return 0.0;
    }

    public Double impactBudget() {
        return calculerMensualite();
    }

    public void planifierRemboursement() {
        // Logique de planification
    }
}
