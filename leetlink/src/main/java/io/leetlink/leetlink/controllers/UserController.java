package io.leetlink.leetlink.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import io.leetlink.leetlink.model.User;
import io.leetlink.leetlink.service.TokenService;
import io.leetlink.leetlink.service.UserService;

@RestController
@CrossOrigin
public class UserController {

  @Autowired
  TokenService tokenService;

  @Autowired
  UserService userService;

  public UserController(TokenService tokenService, UserService userService) {
    this.tokenService = tokenService;
    this.userService = userService;
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