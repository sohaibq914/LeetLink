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
  private UserRepo repo;

  @Autowired
  private JWTService jwtService;

  @Autowired
  AuthenticationManager authManager;

  private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);


  public Users register(Users user) {
    user.setPassword(encoder.encode(user.getPassword()));
    return repo.save(user);
  }


  public String verify(Users user) {
    try {
      Authentication authentication = 
          authManager.authenticate(new UsernamePasswordAuthenticationToken(
              user.getUsername(), 
              user.getPassword()
          ));

      if (authentication.isAuthenticated()) {
          return "Success";
      }
      return "Fail";
  } catch (Exception e) {
      // Log the exception
      System.out.println("Authentication error: " + e.getMessage());
      return "Fail: " + e.getMessage();
  }
}
  
}
