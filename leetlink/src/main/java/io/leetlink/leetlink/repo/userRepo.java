package io.leetlink.leetlink.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.leetlink.leetlink.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
  User findByUsername(String username);

  User findByEmail(String email);
}