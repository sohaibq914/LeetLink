package io.leetlink.backend.service;

import io.leetlink.backend.model.Problem;
import io.leetlink.backend.model.Users;
import io.leetlink.backend.repo.ProblemRepo;
import io.leetlink.backend.repo.UserRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

  @Autowired
  private ProblemRepo problemRepo;

  @Autowired
  private UserRepo userRepo;

  // Get all problems for a user
  public List<Problem> getAllProblemsByUser(String email) {
    Users user = userRepo.findByEmail(email);
    if (user == null) {
      throw new RuntimeException("User not found");
    }
    return problemRepo.findByUser(user);
  }

  // Get a specific problem
  public Problem getProblemById(Long id, String userEmail) {
    Optional<Problem> problem = problemRepo.findById(id);
    if (problem.isPresent()) {
      // Check if the problem belongs to the user
      if (!problem.get().getUser().getEmail().equals(userEmail)) {
        throw new RuntimeException("Access denied");
      }
      return problem.get();
    }
    throw new RuntimeException("Problem not found");
  }

  // Create a new problem
  public Problem createProblem(Problem problem, String userEmail) {
    Users user = userRepo.findByEmail(userEmail);
    if (user == null) {
      throw new RuntimeException("User not found");
    }
    problem.setUser(user);
    return problemRepo.save(problem);
  }

  // Update an existing problem
  public Problem updateProblem(Long id, Problem updatedProblem, String userEmail) {
    Problem existingProblem = getProblemById(id, userEmail);

    // update fields
    existingProblem.setName(updatedProblem.getName());
    existingProblem.setTopic(updatedProblem.getTopic());
    existingProblem.setDifficulty(updatedProblem.getDifficulty());
    existingProblem.setTime(updatedProblem.getTime());
    existingProblem.setNotes(updatedProblem.getNotes());

    return problemRepo.save(existingProblem);
  }

  // Delete a problem
  public void deleteProblem(Long id, String userEmail) {
    Problem problem = getProblemById(id, userEmail);
    problemRepo.delete(problem);
  }
}