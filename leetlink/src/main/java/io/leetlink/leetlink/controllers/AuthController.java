package io.leetlink.leetlink.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.leetlink.leetlink.config.JwtUtil;
import io.leetlink.leetlink.model.AuthRequest;
import io.leetlink.leetlink.model.RegisterAuth;
import io.leetlink.leetlink.model.User;
import io.leetlink.leetlink.repo.UserRepo;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthController(UserRepo userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepo = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/login")
  public ResponseEntity<String> login(@RequestBody AuthRequest authRequest) {
    String email = authRequest.getEmail();
    String password = authRequest.getPassword();

    User user = userRepo.findByEmail(email);
    if (user != null && passwordEncoder.matches(password, user.getPassword())) {
      String token = jwtUtil.generateToken(email);
      return ResponseEntity.ok(token);
    }

    return ResponseEntity.status(401).build();
  }

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody RegisterAuth registerAuth) {
    String email = registerAuth.getEmail();
    String password = registerAuth.getPassword();
    String name = registerAuth.getName();

    if (userRepo.findByEmail(email) != null) {
      return ResponseEntity.status(409).build();
    }

    User user = new User(name, email, passwordEncoder.encode(password));
    userRepo.save(user);

    String token = jwtUtil.generateToken(email);
    return ResponseEntity.ok(token);
  }
}