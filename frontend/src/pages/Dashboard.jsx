import { useState, useEffect } from "react";
import ProblemTable from "../components/ProblemTable";
import FetchLC from "../components/FetchLC";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Dashboard = () => {
  const email = localStorage.getItem("email");
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    difficulty: "Medium",
    solveTimeMinutes: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [reportDifficulty, setReportDifficulty] = useState("Easy");
  const [reportResults, setReportResults] = useState([]);

  const topicOptions = ["Arrays", "Strings", "Linked List", "Stacks", "Queues", "Trees", "Graphs", "Heap", "Hash Table", "Dynamic Programming", "Greedy", "Binary Search", "Recursion", "Bit Manipulation", "Math"];

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`${API_URL}/api/problems`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            window.location.href = "/login";
            return;
          }
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      await fetch(`${API_URL}/api/problems/${problemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProblems(problems.filter((p) => p.id !== problemId));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const fetchReportProblems = async () => {
    try {
      const response = await fetch(`${API_URL}/report/problems?email=${email}&difficulty=${reportDifficulty}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      setReportResults(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setReportResults([]);
    }
  };

  const handleEditProblem = (problemId) => {
    const problemToEdit = problems.find((p) => p.id === problemId);
    if (problemToEdit) {
      setFormData({
        name: problemToEdit.name,
        topic: problemToEdit.topic,
        difficulty: problemToEdit.difficulty,
        solveTimeMinutes: problemToEdit.solveTimeMinutes,
        notes: problemToEdit.notes,
      });
      setEditingProblem(problemId);
      setShowAddForm(true);
    }
  };

  const handleAddProblem = () => {
    setFormData({
      name: "",
      topic: "",
      difficulty: "Medium",
      solveTimeMinutes: "",
      notes: "",
    });
    setFormErrors({});
    setEditingProblem(null);
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Problem name is required";
    if (!formData.topic) errors.topic = "Topic is required";
    if (!formData.difficulty) errors.difficulty = "Difficulty is required";

    const solveTime = parseInt(formData.solveTimeMinutes);
    if (isNaN(solveTime) || solveTime <= 0) {
      errors.solveTimeMinutes = "Please enter a valid time (minutes)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const problemData = {
      ...formData,
      time: parseInt(formData.solveTimeMinutes),
    };

    try {
      if (editingProblem) {
        await fetch(`${API_URL}/api/problems/${editingProblem}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(problemData),
        });

        setProblems(problems.map((problem) => (problem.id === editingProblem ? { ...problem, ...problemData } : problem)));
      } else {
        const response = await fetch(`${API_URL}/api/problems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(problemData),
        });

        const data = await response.json();
        const newId = Math.max(...problems.map((p) => p.id), 0) + 1;
        setProblems([...problems, { id: newId, ...problemData }]);
      }

      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving problem:", error);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>LeetLink Dashboard</h1>
          <div className="user-section">
            <span>Welcome, {email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="section-header">
            <h2>Filter by Difficulty (Report)</h2>
            <select value={reportDifficulty} onChange={(e) => setReportDifficulty(e.target.value)}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <button onClick={fetchReportProblems}>Fetch Report</button>
          </div>

          {reportResults.length > 0 ? (
            <div className="report-results">
              <h3>Results:</h3>
              <ul>
                {reportResults.map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong> - {p.topic} - {p.time} mins
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No report data yet. Try selecting a difficulty and fetching.</p>
          )}

          <div className="section-header">
            <h2>My Practice Problems</h2>
            <button className="add-problem-btn" onClick={handleAddProblem}>
              Add New Problem
            </button>
          </div>

          <ProblemTable problems={problems} isLoading={isLoading} onEditProblem={handleEditProblem} onDeleteProblem={handleDeleteProblem} />
        </div>

        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{editingProblem ? "Edit Problem" : "Add New Problem"}</h3>
              <div className="problem-form">
                <div className="form-group">
                  <label htmlFor="name">Problem Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={formErrors.name ? "error" : ""} />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="topic">Topic</label>
                  <select id="topic" name="topic" value={formData.topic} onChange={handleInputChange} className={formErrors.topic ? "error" : ""}>
                    <option value="">Select a topic</option>
                    {topicOptions.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  {formErrors.topic && <span className="error-text">{formErrors.topic}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="solveTimeMinutes">Time to Solve (minutes)</label>
                  <input type="number" id="solveTimeMinutes" name="solveTimeMinutes" value={formData.solveTimeMinutes} onChange={handleInputChange} min="1" className={formErrors.solveTimeMinutes ? "error" : ""} />
                  {formErrors.solveTimeMinutes && <span className="error-text">{formErrors.solveTimeMinutes}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="4"></textarea>
                </div>
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSubmit}>
                  {editingProblem ? "Update Problem" : "Save Problem"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <FetchLC />
    </>
  );
};

export default Dashboard;
