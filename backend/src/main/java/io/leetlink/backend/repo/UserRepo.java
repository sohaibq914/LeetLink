package io.leetlink.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import io.leetlink.backend.model.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> { // Users is the table, Integer is the PK type
  // custom query method to find user by username
  Users findByUsername(String username);

}