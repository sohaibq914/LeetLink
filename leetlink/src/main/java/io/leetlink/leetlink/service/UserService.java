package io.leetlink.leetlink.service;

import io.leetlink.leetlink.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import io.leetlink.leetlink.repo.UserRepo;

@Component
public class UserService {

  private final UserRepo userRepo;

  public UserService(UserRepo userRepo) {
    this.userRepo = userRepo;
  }

  public User getUserByEmail(String email) {
    return UserRepo.findByEmail(email);
  }
}
