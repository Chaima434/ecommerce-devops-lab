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
public class ObjectifEpargne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String intitule;
    private Double montantCible;
    private Double montantActuel;

    @Temporal(TemporalType.DATE)
    private Date dateEcheance;

    private Integer priorite;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public Double calculerProgres() {
        if (montantCible == null || montantCible == 0) return 0.0;
        return (montantActuel / montantCible) * 100;
    }

    public Double conseilMensuel() {
        // Calcul du montant à épargner chaque mois
        return 0.0;
    }

    public Boolean estAtteint() {
        return montantActuel >= montantCible;
    }
}
