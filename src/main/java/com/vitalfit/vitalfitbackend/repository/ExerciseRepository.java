package com.vitalfit.vitalfitbackend.repository;

import com.vitalfit.vitalfitbackend.domain.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
}
