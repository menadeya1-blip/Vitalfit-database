package com.vitalfit.vitalfitbackend.repository;


import com.vitalfit.vitalfitbackend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Sirve para buscar un usuario por su correo electrónico (ideal para el Login).
    Optional<User> findByEmail(String email);
}
