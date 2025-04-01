package io.leetlink.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.leetlink.backend.model.Problem;
import io.leetlink.backend.service.ReportService;

import java.util.List;

@RestController
public class ReportController {

  @Autowired
  private ReportService reportService;

  @CrossOrigin(origins = "http://localhost:5174")
  @GetMapping("/report/problems")
  public List<Problem> getFilteredProblems(@RequestParam String email, @RequestParam String difficulty) {
    return reportService.getProblemsByDifficulty(email, difficulty);
  }
}
