package io.leetlink.leetlink.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.util.Date;

@Component
public class JwtUtil {
  private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generate a secure key
  private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

  public String generateToken(String email) {
    return Jwts.builder()
        .setSubject(email)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
        .compact();
  }

  public String extractEmail(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(SECRET_KEY)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean isTokenValid(String token, String email) {
    final String extractedEmail = extractEmail(token);
    return extractedEmail.equals(email) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    final Date expiration = Jwts.parserBuilder()
        .setSigningKey(SECRET_KEY)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getExpiration();
    return expiration.before(new Date());
  }
}
