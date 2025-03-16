package io.leetlink.backend.model;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {

  private Users user;

  public UserPrincipal(Users user) {
    this.user = user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singleton(new SimpleGrantedAuthority("USER"));
  }

  // q: isn't getPassword and getUsername already in model?
  // a: yes, but this is for spring to check if username and password is valid
  // during auth process
  @Override
  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public String getUsername() {
    // return email as the username for spring security
    return user.getEmail();
  }

  // add these required methods with default implementations for interface
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

}
