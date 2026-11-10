package com.vitalfit.vitalfitbackend.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "routines")
public class Routine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_type", nullable = false, length = 20)
    private String locationType; // 'GYM', 'HOME'

    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel; // 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'

    @Column(name = "target_muscle_group", nullable = false, length = 50)
    private String targetMuscleGroup;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public String getTargetMuscleGroup() { return targetMuscleGroup; }
    public void setTargetMuscleGroup(String targetMuscleGroup) { this.targetMuscleGroup = targetMuscleGroup; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}