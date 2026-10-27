package com.vitalfit.vitalfitbackend.repository;

import com.vitalfit.vitalfitbackend.domain.model.Consent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsentRepository extends JpaRepository<Consent, Long> {
}
