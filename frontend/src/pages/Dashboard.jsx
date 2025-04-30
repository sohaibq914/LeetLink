import { useState, useEffect } from "react";
import ProblemTable from "../components/ProblemTable";
import FetchLC from "../components/FetchLC";
import "./Dashboard.css";

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

  // Sample topics for dropdown
  const topicOptions = ["Arrays", "Strings", "Linked List", "Stacks", "Queues", "Trees", "Graphs", "Heap", "Hash Table", "Dynamic Programming", "Greedy", "Binary Search", "Recursion", "Bit Manipulation", "Math"];

  // Fetch data from the backend API
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Redirect to login if no token is found
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Handle unauthorized/forbidden
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch problems");
        }

        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
        // Use sample data as fallback for development
        const sampleProblems = [
          { id: 1, name: "Two Sum", topic: "Arrays", difficulty: "Easy", solveTimeMinutes: 15, notes: "Use a hash map to store values and their indices" },
          { id: 2, name: "Add Two Numbers", topic: "Linked List", difficulty: "Medium", solveTimeMinutes: 25, notes: "Create dummy node to handle edge cases" },
          { id: 3, name: "Longest Substring Without Repeating Characters", topic: "Strings", difficulty: "Medium", solveTimeMinutes: 20, notes: "Sliding window with a hash set" },
          { id: 4, name: "Median of Two Sorted Arrays", topic: "Binary Search", difficulty: "Hard", solveTimeMinutes: 45, notes: "Find the correct partition point" },
          { id: 5, name: "Longest Palindromic Substring", topic: "Strings", difficulty: "Medium", solveTimeMinutes: 30, notes: "Expand around center approach" },
          { id: 6, name: "Valid Parentheses", topic: "Stacks", difficulty: "Easy", solveTimeMinutes: 10, notes: "Use a stack to track opening brackets" },
          { id: 7, name: "Merge K Sorted Lists", topic: "Heap", difficulty: "Hard", solveTimeMinutes: 35, notes: "Use a min heap to efficiently merge" },
          { id: 8, name: "Trapping Rain Water", topic: "Arrays", difficulty: "Hard", solveTimeMinutes: 40, notes: "Calculate left and right max heights" },
        ];
        setProblems(sampleProblems);
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
      await fetch(`${import.meta.env.VITE_API_URL}/api/problems/${problemId}`, {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/report/problems?email=${email}&difficulty=${reportDifficulty}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data = await response.json();
      setReportResults(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setReportResults([]); // clear results if failed
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
    // Reset form when adding new problem
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

    // Clear error when field is edited
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
        // Update existing problem
        // In a real app, this would be an API call:
        await fetch(`${import.meta.env.VITE_API_URL}/api/problems/${editingProblem}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(problemData),
        });

        // For demo purposes, update locally:
        setProblems(problems.map((problem) => (problem.id === editingProblem ? { ...problem, ...problemData } : problem)));
      } else {
        // Add new problem
        // In a real app, this would be an API call:
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/problems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(problemData),
        });
        const data = await response.json();
        console.log(data);

        // For demo purposes, add locally with a new ID:
        const newId = Math.max(...problems.map((p) => p.id), 0) + 1;
        setProblems([...problems, { id: newId, ...problemData }]);
      }

      // Close the form after successful submission
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
