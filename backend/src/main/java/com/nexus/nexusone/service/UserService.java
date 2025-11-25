package com.nexus.nexusone.service;

import com.nexus.nexusone.dto.UserDTO;
import com.nexus.nexusone.model.User;
import com.nexus.nexusone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getSpecialization(),
                user.getAvatar(),
                user.getCreatedAt());
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        if (userDTO.getDepartment() != null)
            user.setDepartment(userDTO.getDepartment());
        if (userDTO.getSpecialization() != null)
            user.setSpecialization(userDTO.getSpecialization());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(currentPassword)) {
            throw new RuntimeException("Invalid current password");
        }

        user.setPassword(newPassword);
        userRepository.save(user);
    }
}
