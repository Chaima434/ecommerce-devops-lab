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
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TypeRapport type;
    
    private String periode;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateGeneration;

    private String format;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;

    public void generer() {
        // Logique de génération
        this.dateGeneration = new Date();
    }
    
    // Les autres méthodes retourneraient des objets complexes ou des fichiers
}
