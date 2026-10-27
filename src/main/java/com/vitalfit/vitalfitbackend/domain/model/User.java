package com.vitalfit.vitalfitbackend.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User extends Person {

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "height_cm")
    private Integer heightCm;

    @Column(name = "fitness_goal", length = 30)
    private String fitnessGoal;

    @Column(name = "dark_mode", nullable = false)
    private Boolean darkMode = false;

    @Column(name = "parental_consent_required", nullable = false)
    private Boolean parentalConsentRequired = false;

    @Column(name = "parental_consent_at")
    private LocalDateTime parentalConsentAt;

    public User() {
        super();
    }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public Integer getHeightCm() { return heightCm; }
    public void setHeightCm(Integer heightCm) { this.heightCm = heightCm; }

    public String getFitnessGoal() { return fitnessGoal; }
    public void setFitnessGoal(String fitnessGoal) { this.fitnessGoal = fitnessGoal; }

    public Boolean getDarkMode() { return darkMode; }
    public void setDarkMode(Boolean darkMode) { this.darkMode = darkMode; }

    public Boolean getParentalConsentRequired() { return parentalConsentRequired; }
    public void setParentalConsentRequired(Boolean parentalConsentRequired) { this.parentalConsentRequired = parentalConsentRequired; }

    public LocalDateTime getParentalConsentAt() { return parentalConsentAt; }
    public void setParentalConsentAt(LocalDateTime parentalConsentAt) { this.parentalConsentAt = parentalConsentAt; }

    // Un menor de edad no puede entrar hasta que un padre o tutor dé su consentimiento.
    public boolean isPendingParentalConsent() {
        return Boolean.TRUE.equals(parentalConsentRequired) && parentalConsentAt == null;
    }
}
