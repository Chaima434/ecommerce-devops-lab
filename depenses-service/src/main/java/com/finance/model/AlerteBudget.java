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
public class AlerteBudget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double seuilAlerte;
    private String typeAlerte;
    private String message;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateEnvoi;

    private Boolean estLue;

    @ManyToOne
    @JoinColumn(name = "budget_id")
    private Budget budget;

    public void envoyer() {
        // Logique d'envoi
    }

    public void marquerLue() {
        this.estLue = true;
    }
}
