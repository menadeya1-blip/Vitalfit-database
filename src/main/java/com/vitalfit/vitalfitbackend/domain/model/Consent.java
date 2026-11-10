package com.vitalfit.vitalfitbackend.domain.model;

import com.vitalfit.vitalfitbackend.domain.enums.ConsentType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consents")
public class Consent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "consent_type", nullable = false, length = 30)
    private ConsentType consentType;

    @Column(name = "document_version", nullable = false, length = 20)
    private String documentVersion;

    @Column(nullable = false)
    private Boolean accepted;

    @Column(name = "accepted_at", nullable = false)
    private LocalDateTime acceptedAt = LocalDateTime.now();

    public Consent() {
    }

    public Consent(User user, ConsentType consentType, String documentVersion, boolean accepted) {
        this.user = user;
        this.consentType = consentType;
        this.documentVersion = documentVersion;
        this.accepted = accepted;
        this.acceptedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public ConsentType getConsentType() { return consentType; }
    public String getDocumentVersion() { return documentVersion; }
    public Boolean getAccepted() { return accepted; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
}
