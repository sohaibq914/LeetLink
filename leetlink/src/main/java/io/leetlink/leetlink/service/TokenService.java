package io.leetlink.leetlink.service;

import org.springframework.stereotype.Service;
import io.leetlink.leetlink.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class TokenService {

  private final JwtUtil jwtUtil;

  @Autowired
  public TokenService(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  public String generateToken(String email) {
    return jwtUtil.generateToken(email);
  }

  public String extractEmail(String token) {
    return jwtUtil.extractEmail(token);
  }

  public boolean validateToken(String token, String email) {
    return jwtUtil.isTokenValid(token, email);
  }
}