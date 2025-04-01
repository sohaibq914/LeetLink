package io.leetlink.backend.repo;

import io.leetlink.backend.model.Problem;
import io.leetlink.backend.model.Users;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepo extends JpaRepository<Problem, Long> {
  // * these methods names are not random

  // Find all problems for a specific user
  List<Problem> findByUser(Users user);

  // Find problems by user and with topic
  List<Problem> findByUserAndTopic(Users user, String topic);

  // Find problems by user and difficulty
  List<Problem> findByUserAndDifficulty(Users user, String difficulty);

  // Find problems by solving time range
  List<Problem> findByUserAndTimeBetween(
      Users user, Integer minTime, Integer maxTime);
}