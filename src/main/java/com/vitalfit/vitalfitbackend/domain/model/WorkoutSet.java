package com.vitalfit.vitalfitbackend.domain.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "workout_sets")
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private WorkoutSession session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "set_number", nullable = false)
    private Integer setNumber;

    @Column(name = "weight_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(nullable = false)
    private Integer reps;

    public WorkoutSet() {
    }

    public WorkoutSet(WorkoutSession session, Exercise exercise, Integer setNumber, BigDecimal weightKg, Integer reps) {
        this.session = session;
        this.exercise = exercise;
        this.setNumber = setNumber;
        this.weightKg = weightKg;
        this.reps = reps;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public WorkoutSession getSession() { return session; }
    public void setSession(WorkoutSession session) { this.session = session; }
    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
    public Integer getSetNumber() { return setNumber; }
    public void setSetNumber(Integer setNumber) { this.setNumber = setNumber; }
    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }
    public Integer getReps() { return reps; }
    public void setReps(Integer reps) { this.reps = reps; }
}
