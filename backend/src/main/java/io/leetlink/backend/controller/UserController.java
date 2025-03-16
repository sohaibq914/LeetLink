package io.leetlink.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.leetlink.backend.model.Users;
import io.leetlink.backend.service.UserService;

@RestController
public class UserController {

  @Autowired
  private UserService service;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Users user) {
    try {
      Users registeredUser = service.register(user);
      Map<String, Object> response = new HashMap<>();
      response.put("message", "User registered successfully");
      response.put("email", registeredUser.getEmail());
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();
      response.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Users user) {
    try {
      String token = service.verify(user);
      Map<String, Object> response = new HashMap<>();
      response.put("token", token);
      response.put("email", user.getEmail());
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();
      response.put("error", "Invalid credentials");
      return ResponseEntity.badRequest().body(response);
    }
  }
}
