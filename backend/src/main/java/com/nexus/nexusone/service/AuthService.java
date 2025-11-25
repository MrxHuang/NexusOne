package com.nexus.nexusone.service;

import com.nexus.nexusone.dto.AuthResponse;
import com.nexus.nexusone.dto.LoginRequest;
import com.nexus.nexusone.dto.RegisterRequest;
import com.nexus.nexusone.dto.UserDTO;
import com.nexus.nexusone.model.User;
import com.nexus.nexusone.repository.UserRepository;
import com.nexus.nexusone.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setDepartment(request.getDepartment());
        user.setSpecialization(request.getSpecialization());
        user.setAvatar(generateAvatar(request.getName()));

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        UserDTO userDTO = mapToDTO(user);

        return new AuthResponse(token, userDTO);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getRole() != request.getRole()) {
            throw new RuntimeException("Invalid role for this user");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        UserDTO userDTO = mapToDTO(user);

        return new AuthResponse(token, userDTO);
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setDepartment(user.getDepartment());
        dto.setSpecialization(user.getSpecialization());
        dto.setAvatar(user.getAvatar());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private String generateAvatar(String name) {
        String[] parts = name.split(" ");
        String initials = parts.length > 1 ? parts[0] + "+" + parts[1] : name;
        return "https://ui-avatars.com/api/?name=" + initials + "&background=4f46e5&color=fff";
    }
}
