package io.leetlink.backend.controller;

import io.leetlink.backend.model.Problem;
import io.leetlink.backend.service.ProblemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:5173") // For Vite dev server
public class ProblemController {

  @Autowired
  private ProblemService problemService;

  // Get all problems for the authenticated user
  @GetMapping
  public ResponseEntity<List<Problem>> getAllProblems(Authentication authentication) {
    String userEmail = authentication.getName();
    List<Problem> problems = problemService.getAllProblemsByUser(userEmail);
    return ResponseEntity.ok(problems);
  }

  // Get a specific problem
  @GetMapping("/{id}")
  public ResponseEntity<Problem> getProblemById(@PathVariable Long id, Authentication authentication) {
    try {
      String userEmail = authentication.getName();
      Problem problem = problemService.getProblemById(id, userEmail);
      return ResponseEntity.ok(problem);
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  // Create a new problem
  @PostMapping
  public ResponseEntity<?> createProblem(@RequestBody Problem problem, Authentication authentication) {
    try {
      String userEmail = authentication.getName();
      Problem createdProblem = problemService.createProblem(problem, userEmail);
      return ResponseEntity.ok(createdProblem);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  // Update an existing problem
  @PutMapping("/{id}")
  public ResponseEntity<?> updateProblem(
      @PathVariable Long id,
      @RequestBody Problem problem,
      Authentication authentication) {
    try {
      String userEmail = authentication.getName();
      Problem updatedProblem = problemService.updateProblem(id, problem, userEmail);
      return ResponseEntity.ok(updatedProblem);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  // Delete a problem
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteProblem(@PathVariable Long id, Authentication authentication) {
    try {
      String userEmail = authentication.getName();
      problemService.deleteProblem(id, userEmail);

      Map<String, String> response = new HashMap<>();
      response.put("message", "Problem deleted successfully");
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }
}