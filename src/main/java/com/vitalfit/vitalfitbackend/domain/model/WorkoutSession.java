package com.vitalfit.vitalfitbackend.domain.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "workout_sessions")
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id")
    private Routine routine;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    public WorkoutSession() {
    }

    public WorkoutSession(User user, Routine routine) {
        this.user = user;
        this.routine = routine;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Routine getRoutine() { return routine; }
    public void setRoutine(Routine routine) { this.routine = routine; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
}
