package com.vitalfit.vitalfitbackend.service;

import com.vitalfit.vitalfitbackend.domain.model.User;
import com.vitalfit.vitalfitbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service

public class UserService {

    @Autowired
    private UserRepository userRepository;

    //Para registrar un usuario nuevo
    public User registerUser(User user){
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()){
            throw new RuntimeException("El correo electronico ya esta registrado.");
        }
        //Guardamos el usuario en la base de datos
        return  userRepository.save(user);
    }

    //para verficiar credenciales

    public User loginUser(String email, String password){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!user.getPassword().equals(password)){
            throw new RuntimeException("Contraseña incorrecta");
        }
        return user;
    }

    //Actualizar datos del Onboarding
    public  User updateOnboarding(Long userId, Double weightkg, Double heightcm, String fitnessgoal){
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new RuntimeException("Usuario no encontrado"));

        user.setWeightKg(weightkg);
        user.setHeightCm(heightcm);
        user.setFitnessGoal(fitnessgoal);

        return userRepository.save(user);
    }



}
