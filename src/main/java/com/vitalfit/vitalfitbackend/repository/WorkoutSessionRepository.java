package com.vitalfit.vitalfitbackend.repository;

import com.vitalfit.vitalfitbackend.domain.model.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
}
