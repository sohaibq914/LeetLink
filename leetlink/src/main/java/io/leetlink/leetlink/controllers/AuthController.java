package io.leetlink.leetlink.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.leetlink.leetlink.config.JwtUtil;
import io.leetlink.leetlink.model.AuthRequest;
import io.leetlink.leetlink.model.RegisterAuth;
import io.leetlink.leetlink.model.User;
import io.leetlink.leetlink.repo.UserRepo;

@RestController
@CrossOrigin // Allow only your frontend's URL
public class AuthController {

  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthController(UserRepo userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepo = userRepository;
    this.passwordEncoder = passwordEncoder;

    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/auth/register")
  public ResponseEntity<String> Register(@RequestBody RegisterAuth registerAuth) {
    String email = registerAuth.getEmail();
    String password = registerAuth.getPassword();
    String name = registerAuth.getName();

    if (userRepo.findByEmail(email) != null) {
      return ResponseEntity.status(409).build();
    }

    userRepo.save(new User(name, email, passwordEncoder.encode(password)));
    return ResponseEntity.ok(jwtUtil.generateToken(userRepo.findByEmail(email).getEmail()));

  }

  @PostMapping("/auth/Login")
  public ResponseEntity<String> Login(@RequestBody AuthRequest authRequest) {

    String email = authRequest.getEmail();
    String password = authRequest.getPassword();

    if (userRepo.findByEmail(email) != null) {

      User loginUser = userRepo.findByEmail(email);

      boolean login_status = passwordEncoder.matches(password, loginUser.getPassword());

      if (!login_status)
        return ResponseEntity.status(401).build();
      // retunr jwt token

      return ResponseEntity.ok(jwtUtil.generateToken(loginUser.getEmail()));
    }

    return ResponseEntity.notFound().build();

  }
}
