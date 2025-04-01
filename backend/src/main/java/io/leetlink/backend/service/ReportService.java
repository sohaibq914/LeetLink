package io.leetlink.backend.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.leetlink.backend.model.Problem;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class ReportService {

  @Autowired
  private JdbcTemplate jdbcTemplate; // let's me run raw sql queries

  // This method uses a manually written prepared statement
  public List<Problem> getProblemsByDifficulty(String email, String difficulty) {
    // "?" will be filled with the Object[] array
    // not hardcoded values, which avoids SQL injections
    String sql = "SELECT * FROM problem WHERE email = ? AND difficulty = ?";

    // new ProblemRowMapper converts each result into a Problem object
    return jdbcTemplate.query(sql, new Object[] { email, difficulty }, new ProblemRowMapper());
  }

  private static class ProblemRowMapper implements RowMapper<Problem> {
    @Override
    public Problem mapRow(ResultSet rs, int rowNum) throws SQLException {
      Problem problem = new Problem();
      problem.setId(rs.getLong("id"));
      problem.setName(rs.getString("name"));
      problem.setTopic(rs.getString("topic"));
      problem.setDifficulty(rs.getString("difficulty"));
      problem.setTime(rs.getInt("time"));
      problem.setNotes(rs.getString("notes"));
      return problem;
    }
  }

}
