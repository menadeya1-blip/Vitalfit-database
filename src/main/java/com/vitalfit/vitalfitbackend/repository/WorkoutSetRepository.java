package com.vitalfit.vitalfitbackend.repository;

import com.vitalfit.vitalfitbackend.domain.model.WorkoutSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, Long> {

    // Cuenta las series ya guardadas de un ejercicio en una sesión, para numerar la siguiente.
    long countBySessionIdAndExerciseId(Long sessionId, Long exerciseId);
}
