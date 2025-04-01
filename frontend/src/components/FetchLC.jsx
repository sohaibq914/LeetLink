import { useState } from "react";
import "./FetchLC.css";

const FetchLC = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    if (!username.trim()) {
      setError("Please enter a LeetCode username");
      return;
    }

    setIsLoading(true);
    setError(null);
    // const response = await fetch("/leetcode-api/graphql", {

    try {
      // Use a CORS proxy for development
      // const corsProxy = "https://corsproxy.io/?";
      const response = await fetch("/leetcode-api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
              query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                  username
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                      submissions
                    }
                  }
                  profile {
                    ranking
                    reputation
                    starRating
                  }
                  submitStatsGlobal {
                    acSubmissionNum {
                      difficulty
                      count
                    }
                  }
                }
                userContestRanking(username: $username) {
                  attendedContestsCount
                  rating
                  globalRanking
                  totalParticipants
                }
                recentSubmissionList(username: $username, limit: 50) {
                  id
                  title
                  titleSlug
                  timestamp
                  statusDisplay
                  lang
                }
                allQuestionsCount {
                  difficulty
                  count
                }
              }
            `,
          variables: {
            username: username,
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message || "Failed to fetch user data");
      }

      if (!data.data.matchedUser) {
        throw new Error("User not found");
      }

      console.log("LeetCode Data:", data.data);

      // Display all problem names from recent submissions
      const submissions = data.data.recentSubmissionList || [];
      console.log("Recent Solved Problems:");

      // Create a Set to store unique problem titles
      const uniqueProblems = new Set();

      // Filter for accepted submissions and log them
      submissions.forEach((submission) => {
        if (submission.statusDisplay === "Accepted") {
          uniqueProblems.add(submission.title);
          console.log(`- ${submission.title} (${submission.lang})`);
        }
      });

      // Display basic info in the UI as well
      const user = data.data.matchedUser;
      const problemCount = user.submitStats.acSubmissionNum.find((x) => x.difficulty === "All")?.count || 0;

      alert(`Found user: ${user.username}\n` + `Ranking: ${user.profile.ranking || "N/A"}\n` + `Total Solved: ${problemCount} problems\n\n` + `Recently solved problems are logged to the console.\n` + `(Press F12 to view)`);
    } catch (err) {
      console.error("Error fetching LeetCode data:", err);
      setError(err.message || "Failed to fetch LeetCode data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="leetcode-fetch-container">
      <h2>LeetCode Profile Fetcher</h2>
      <div className="input-group">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter LeetCode username" disabled={isLoading} />
        <button onClick={handleFetch} disabled={isLoading} className="fetch-button">
          {isLoading ? "Loading..." : "Fetch Profile"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FetchLC;
