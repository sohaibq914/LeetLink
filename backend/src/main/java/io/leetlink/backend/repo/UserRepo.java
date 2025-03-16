package io.leetlink.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.leetlink.backend.model.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, String> { // Users is the table, String is the PK type
  // custom query method to find user by username
  // Users findByUsername(String username);

  Users findByEmail(String email);

}