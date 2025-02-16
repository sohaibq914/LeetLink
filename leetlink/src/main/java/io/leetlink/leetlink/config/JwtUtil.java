package io.leetlink.leetlink.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
  // Use a constant string secret instead of generating a new key each time
  private static final String SECRET_STRING = "your_very_long_and_secure_secret_key_that_is_at_least_256_bits_long_for_hs256";
  private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));
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
    try {
      Claims claims = Jwts.parserBuilder()
          .setSigningKey(SECRET_KEY)
          .build()
          .parseClaimsJws(token)
          .getBody();
      System.out.println("Extracted claims: " + claims);
      return claims.getSubject();
    } catch (Exception e) {
      System.out.println("Error extracting email: " + e.getMessage());
      return null;
    }
  }

  public boolean isTokenValid(String token, String email) {
    final String extractedEmail = extractEmail(token);
    return email != null && email.equals(extractedEmail) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    try {
      final Date expiration = Jwts.parserBuilder()
          .setSigningKey(SECRET_KEY)
          .build()
          .parseClaimsJws(token)
          .getBody()
          .getExpiration();
      return expiration.before(new Date());
    } catch (Exception e) {
      return true;
    }
  }
}