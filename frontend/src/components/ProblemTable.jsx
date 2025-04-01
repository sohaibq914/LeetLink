import { useState } from "react";
import "./ProblemTable.css";

const ProblemTable = ({ problems, isLoading, onEditProblem, onDeleteProblem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterTimeRange, setFilterTimeRange] = useState("");

  // Extract unique topics and difficulties for filter dropdowns
  const topics = [...new Set(problems.map((problem) => problem.topic))];
  const difficulties = [...new Set(problems.map((problem) => problem.difficulty))];

  // Time ranges for filtering
  const timeRanges = [
    { value: "0-10", label: "0-10 minutes" },
    { value: "11-20", label: "11-20 minutes" },
    { value: "21-30", label: "21-30 minutes" },
    { value: "30+", label: "30+ minutes" },
  ];

  // Filter problems based on search term and filters
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.name.toLowerCase().includes(searchTerm.toLowerCase()) || problem.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === "" || problem.topic === filterTopic;
    const matchesDifficulty = filterDifficulty === "" || problem.difficulty === filterDifficulty;

    // Time range filter
    let matchesTimeRange = true;
    if (filterTimeRange !== "") {
      const time = problem.solveTimeMinutes || 0;
      if (filterTimeRange === "0-10") {
        matchesTimeRange = time >= 0 && time <= 10;
      } else if (filterTimeRange === "11-20") {
        matchesTimeRange = time >= 11 && time <= 20;
      } else if (filterTimeRange === "21-30") {
        matchesTimeRange = time >= 21 && time <= 30;
      } else if (filterTimeRange === "30+") {
        matchesTimeRange = time > 30;
      }
    }

    return matchesSearch && matchesTopic && matchesDifficulty && matchesTimeRange;
  });

  // Get difficulty class for styling
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "difficulty-easy";
      case "medium":
        return "difficulty-medium";
      case "hard":
        return "difficulty-hard";
      default:
        return "";
    }
  };

  return (
    <div className="problem-table-container">
      <div className="controls">
        <div className="search-bar">
          <input type="text" placeholder="Search problems or notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="filters">
          <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} aria-label="Filter by topic">
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} aria-label="Filter by difficulty">
            <option value="">All Difficulties</option>
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>

          <select value={filterTimeRange} onChange={(e) => setFilterTimeRange(e.target.value)} aria-label="Filter by time range">
            <option value="">All Time Ranges</option>
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading problems...</div>
      ) : (
        <div className="table-container">
          <table className="problems-table">
            <thead>
              <tr>
                <th>Problem Name</th>
                <th>Topic</th>
                <th>Difficulty</th>
                <th>Time to Solve (min)</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((problem) => (
                  <tr key={problem.id}>
                    <td>{problem.name}</td>
                    <td>{problem.topic}</td>
                    <td>
                      <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>{problem.difficulty}</span>
                    </td>
                    <td>{problem.time || "-"}</td>
                    <td className="notes-cell">{problem.notes}</td>
                    <td>
                      <button className="action-btn edit-btn" onClick={() => onEditProblem(problem.id)}>
                        Edit
                      </button>
                      <button className="action-btn delete-btn" onClick={() => onDeleteProblem(problem.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No problems found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-footer">
        <div className="stats">
          Showing {filteredProblems.length} of {problems.length} problems
        </div>
      </div>
    </div>
  );
};

export default ProblemTable;
