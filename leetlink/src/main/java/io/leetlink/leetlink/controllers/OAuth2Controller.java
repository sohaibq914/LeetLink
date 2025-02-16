package io.leetlink.leetlink.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.leetlink.leetlink.config.JwtUtil;
import io.leetlink.leetlink.model.User;
import io.leetlink.leetlink.repo.UserRepo;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class OAuth2Controller {

  private final UserRepo userRepo;
  private final JwtUtil jwtUtil;
  private final PasswordEncoder passwordEncoder;

  public OAuth2Controller(UserRepo userRepo, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
    this.userRepo = userRepo;
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = passwordEncoder;
  }

  @GetMapping("/google")
  public ResponseEntity<String> handleGoogleLogin(@RequestParam String code) {
    // Exchange code for tokens using RestTemplate
    RestTemplate restTemplate = new RestTemplate();
    String tokenUrl = "https://oauth2.googleapis.com/token";

    // Add your token exchange logic here
    // Then create or update user and generate JWT

    try {
      // Get user info from Google
      String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
      // Add user info fetch logic

      // Check if user exists
      String email = ""; // Get from Google response
      User user = userRepo.findByEmail(email);

      if (user == null) {
        // Create new user
        String randomPassword = passwordEncoder.encode("" + System.currentTimeMillis());
        user = new User("", email, randomPassword);
        userRepo.save(user);
      }

      // Generate JWT token
      String token = jwtUtil.generateToken(email);

      return ResponseEntity.ok(token);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed");
    }
  }
}