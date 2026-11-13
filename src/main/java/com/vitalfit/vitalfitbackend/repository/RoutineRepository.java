package com.vitalfit.vitalfitbackend.repository;

import com.vitalfit.vitalfitbackend.domain.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
}
