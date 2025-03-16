package io.leetlink.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import io.leetlink.backend.model.Users;
import io.leetlink.backend.repo.UserRepo;

@Service
public class UserService {

  @Autowired // auto injects the bean
  private UserRepo userRepo;

  @Autowired
  private JWTService jwtService;

  @Autowired
  AuthenticationManager authManager;

  private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

  public Users register(Users user) {

    // Check if user already exists
    if (userRepo.findByEmail(user.getEmail()) != null) {
      throw new RuntimeException("User with this email already exists");
    }

    user.setPassword(encoder.encode(user.getPassword()));
    return userRepo.save(user);
  }

  public String verify(Users user) {
    Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(
        user.getEmail(),
        user.getPassword()));

    if (authentication.isAuthenticated()) {
      return jwtService.generateToken(user.getEmail());
    }
    return "Fail";
  }
}
