package io.leetlink.leetlink.controllers;

import io.leetlink.leetlink.model.User;
import io.leetlink.leetlink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import io.leetlink.leetlink.service.TokenService;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

  @Autowired
  TokenService tokenService;

  @Autowired
  UserService userService;

  public UserController(TokenService tokenService, UserService userService) {
    this.tokenService = tokenService;
    this.userService = userService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User user) {
    try {
      User registeredUser = userService.register(user);
      String token = tokenService.generateToken(registeredUser);

      Map<String, Object> response = new HashMap<>();
      response.put("token", token);
      response.put("user", registeredUser);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody User user) {
    try {
      String token = userService.verify(user);
      User authenticatedUser = userService.getUserByEmail(user.getEmail());

      Map<String, Object> response = new HashMap<>();
      response.put("token", token);
      response.put("user", authenticatedUser);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/current-user")
  public ResponseEntity<User> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null && authentication.getName() != null) {
      String currentUser = authentication.getName();
      User user = userService.getUserByEmail(currentUser);
      if (user != null) {
        return ResponseEntity.ok(user);
      }
    }
    return ResponseEntity.notFound().build();
  }
}