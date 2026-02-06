import React, { useState, useEffect } from "react";
import "./ProjectSelectionModule.css";


const IBPProjectSelection = () => {
  const [activeScreen, setActiveScreen] = useState("stage1");
  const [scores, setScores] = useState({
    ws1: 0.75,
    ws2: 1.5,
    ws3: 0.45,
    ws4: 0.3,
    ws5: 0.5,
    ws6: 0.25,
    ws7: 0.3,
    ws8: 0.25,
  });

  const [comments, setComments] = useState({
    ws1: "Core NDP IV project",
    ws2: "Strong ministerial support",
    ws3: "EIRR exceeds target by 7%",
    ws4: "Digital system, minimal emissions",
    ws5: "Universal health coverage benefits",
    ws6: "Full compliance",
    ws7: "~350 health IT jobs",
    ws8: "All districts covered",
  });

  const [selectedScores, setSelectedScores] = useState({
    ws1: "5",
    ws2: "5",
    ws3: "3",
    ws4: "3",
    ws5: "5",
    ws6: "5",
    ws7: "3",
    ws8: "5",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [stage3SearchTerm, setStage3SearchTerm] = useState("");

  const projectsData = [
    {
      rank: 1,
      badgeType: "gold",
      projectName: "National Health Information System",
      mda: "Ministry of Health",
      score: "4.30",
      cost: "85",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 2,
      badgeType: "silver",
      projectName: "Renewable Energy Grid Expansion",
      mda: "Ministry of Energy",
      score: "4.25",
      cost: "320",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 3,
      badgeType: "bronze",
      projectName: "Agricultural Value Chain Development",
      mda: "Ministry of Agriculture",
      score: "4.15",
      cost: "150",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 4,
      badgeType: "",
      projectName: "Digital Education Platform",
      mda: "Ministry of Education",
      score: "4.10",
      cost: "95",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 5,
      badgeType: "",
      projectName: "Water Supply Infrastructure - Western",
      mda: "Ministry of Water",
      score: "4.05",
      cost: "280",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 6,
      badgeType: "",
      projectName: "Urban Public Transport System",
      mda: "Ministry of Works",
      score: "3.95",
      cost: "450",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 7,
      badgeType: "",
      projectName: "Tourism Infrastructure Development",
      mda: "Ministry of Tourism",
      score: "3.90",
      cost: "180",
      status: "Selected - Code Assigned",
      statusType: "success",
      rowStyle: null,
    },
    {
      rank: 8,
      badgeType: "",
      projectName: "Regional Hospital Construction",
      mda: "Ministry of Health",
      score: "3.85",
      cost: "380",
      status: "Not Selected - Fiscal Space",
      statusType: "warning",
      rowStyle: { background: "#fff5f5" },
    },
    {
      rank: 9,
      badgeType: "",
      projectName: "Industrial Park Development",
      mda: "Ministry of Trade",
      score: "3.80",
      cost: "420",
      status: "Not Selected - Fiscal Space",
      statusType: "warning",
      rowStyle: { background: "#fff5f5" },
    },
    {
      rank: 10,
      badgeType: "",
      projectName: "ICT Infrastructure Upgrade",
      mda: "Ministry of ICT",
      score: "3.75",
      cost: "125",
      status: "Not Selected - Fiscal Space",
      statusType: "warning",
      rowStyle: { background: "#fff5f5" },
    },
  ];

  const filteredProjects = projectsData.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.mda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.score.includes(searchTerm) ||
      project.cost.includes(searchTerm)
  );

  const stage3ProjectsData = [
    {
      rank: 1,
      badgeType: "gold",
      projectName: "National Health Information System",
      mda: "Health",
      score: "4.30",
      cost: "85",
      cumulative: "85",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 2,
      badgeType: "silver",
      projectName: "Renewable Energy Grid Expansion",
      mda: "Energy",
      score: "4.25",
      cost: "320",
      cumulative: "405",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 3,
      badgeType: "bronze",
      projectName: "Agricultural Value Chain Development",
      mda: "Agriculture",
      score: "4.15",
      cost: "150",
      cumulative: "555",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 4,
      badgeType: "",
      projectName: "Digital Education Platform",
      mda: "Education",
      score: "4.10",
      cost: "95",
      cumulative: "650",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 5,
      badgeType: "",
      projectName: "Water Supply Infrastructure - Western",
      mda: "Water",
      score: "4.05",
      cost: "280",
      cumulative: "930",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 6,
      badgeType: "",
      projectName: "Urban Public Transport System",
      mda: "Works",
      score: "3.95",
      cost: "450",
      cumulative: "1,380",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 7,
      badgeType: "",
      projectName: "Tourism Infrastructure Development",
      mda: "Tourism",
      score: "3.90",
      cost: "180",
      cumulative: "1,560",
      fitInBudget: "✓ Yes",
      fitInBudgetType: "success",
      rowStyle: null,
    },
    {
      rank: 8,
      badgeType: "",
      projectName: "Regional Hospital Construction",
      mda: "Health",
      score: "3.85",
      cost: "380",
      cumulative: "1,940",
      fitInBudget: "✗ No",
      fitInBudgetType: "danger",
      rowStyle: { background: "#fff5f5" },
    },
    {
      rank: 9,
      badgeType: "",
      projectName: "Industrial Park Development",
      mda: "Trade",
      score: "3.80",
      cost: "420",
      cumulative: "2,360",
      fitInBudget: "✗ No",
      fitInBudgetType: "danger",
      rowStyle: { background: "#fff5f5" },
    },
  ];

  const filteredStage3Projects = stage3ProjectsData.filter(
    (project) =>
      project.projectName.toLowerCase().includes(stage3SearchTerm.toLowerCase()) ||
      project.mda.toLowerCase().includes(stage3SearchTerm.toLowerCase()) ||
      project.score.includes(stage3SearchTerm) ||
      project.cost.includes(stage3SearchTerm) ||
      project.cumulative.includes(stage3SearchTerm)
  );

  const calculateTotalScore = () =>
    Object.values(scores).reduce((a, b) => a + b, 0).toFixed(2);

  const handleScoreChange = (e, weight, key) => {
    if (!e || !e.target) return;
    const selectedValue = e.target.value || "";
    const value = parseFloat(selectedValue) || 0;
    const weighted = (value * weight) / 100;
    setScores((prev) => ({ ...prev, [key]: weighted }));
    setSelectedScores((prev) => ({ ...prev, [key]: selectedValue }));
  };

  const handleCommentChange = (key, value) => {
    setComments((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="ibp-wrapper">
      {/* Navigation Tabs - Fixed Header */}
      <div className="nav-tabs">
        {[
          { id: "stage1", label: "Stage 1: Readiness Check" },
          { id: "stage2", label: "Stage 2: Scoring" },
          { id: "stage3", label: "Stage 3: Fiscal Space" },
          { id: "ranking", label: "Project Rankings" },
        ].map((tab) => (
          <div
            key={tab.id}
            className={`nav-tab ${activeScreen === tab.id ? "active" : ""}`}
            onClick={() => setActiveScreen(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Main Container - Scrollable Content */}
      <div className="container-scrollable">
        <div className="container">
          {/* Stage 1 */}
          {activeScreen === "stage1" && (
            <div className="screen active">
              <div className="card">
              <h2>✅ Stage 1: Project Readiness Checklist</h2>
              <div className="project-info">
                <div className="info-item">
                  <div className="info-label">Project</div>
                  <div className="info-value">
                    Kampala-Jinja Expressway Phase II
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">MDA</div>
                  <div className="info-value">
                    Ministry of Works & Transport
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Cost</div>
                  <div className="info-value">UGX 450 Billion</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Status</div>
                  <div className="info-value">
                    <span className="status-badge info">Under Review</span>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning">
                <span>⚠️</span>
                <div>
                  <strong>Binary Assessment:</strong> All checklist items must
                  be satisfied for the project to proceed to Stage 2.
                </div>
              </div>

              <h3>Readiness Criteria</h3>

              {[
                {
                  title: "1. Approved Feasibility Study",
                  desc: "Does the project have a complete and approved feasibility study?",
                  verified: true,
                },
                {
                  title: "2. Land / Right of Way",
                  desc: "Has the land been secured or costs included in the work plan?",
                  verified: true,
                },
                {
                  title: "3. Results & Logical Framework",
                  desc: "Is there a results framework for monitoring and evaluation?",
                  verified: true,
                },
                {
                  title: "4. Approved Physical Plans",
                  desc: "Are physical plans for utilities approved?",
                  verified: false,
                },
                {
                  title: "5. Detailed Procurement Plan",
                  desc: "Is there a comprehensive procurement plan in place?",
                  verified: true,
                  buttonText: "📄 View Procurement Plan",
                },
                {
                  title: "6. Detailed Implementation Plan",
                  desc: "Is there a detailed implementation plan with timelines?",
                  verified: true,
                  buttonText: "📄 View Implementation Plan",
                },
                {
                  title: "7. Signed Financing Agreements",
                  desc: "Are all financing agreements signed and secured?",
                  verified: true,
                  buttonText: "📄 View Agreements",
                },
                {
                  title: "8. Project Appraisal Document (PAD)",
                  desc: "Is the PAD complete and approved by Development Committee?",
                  verified: true,
                  buttonText: "📄 View PAD",
                },
              ].map((item, i) => (
                <div
                  className={`checklist-item ${item.verified ? "checked" : ""}`}
                  key={i}
                >
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={item.verified}
                    readOnly
                  />
                  <div className="checklist-content">
                    <div className="checklist-title">{item.title}</div>
                    <div className="checklist-desc">{item.desc}</div>
                    <div className="document-upload">
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        {item.buttonText || (item.verified ? "📄 View Document" : "📤 Upload Document")}
                      </button>
                      <span
                        style={{
                          color: item.verified ? "#48bb78" : "#ed8936",
                          fontSize: "14px",
                        }}
                      >
                        {item.verified ? "✓ Verified" : "⚠️ Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="alert alert-warning" style={{ marginTop: 25 }}>
                <span>⚠️</span>
                <div>
                  <strong>Assessment Incomplete:</strong> One or more items are
                  pending. Project cannot proceed to Stage 2.
                </div>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary">
                  Request Clarification
                </button>
                <button className="btn btn-danger">Reject Project</button>
                <button className="btn btn-success" disabled>
                  Approve to Stage 2 ➜
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2 */}
        {activeScreen === "stage2" && (
          <div className="screen active">
            <div className="card">
              <h2>🎯 Stage 2: Multicriteria Analysis - Weighted Scoring</h2>

              <div className="project-info">
                <div className="info-item">
                  <div className="info-label">Project</div>
                  <div className="info-value">National Health Information System</div>
                </div>
                <div className="info-item">
                  <div className="info-label">MDA</div>
                  <div className="info-value">Ministry of Health</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Cost</div>
                  <div className="info-value">UGX 85 Billion</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Stage 1 Status</div>
                  <div className="info-value">
                    <span className="status-badge success">Passed</span>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <span>ℹ️</span>
                <div>
                  <strong>Scoring Guide:</strong> High (5) = Fully met / Great significance | Medium (3) = Partially met / Moderate | Low (1) = Not met / Low significance
                </div>
              </div>

              <h3>Parameter Scoring</h3>

              <table className="scoring-table">
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>Parameter</th>
                    <th style={{ width: "10%" }}>Weight</th>
                    <th style={{ width: "15%" }}>Score (1,3,5)</th>
                    <th style={{ width: "15%" }}>Weighted Score</th>
                    <th style={{ width: "25%" }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>1. Strategic Alignment</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Alignment to NDP IV and Vision 2040</small>
                    </td>
                    <td><span className="weight-badge">15%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws1}
                        onChange={(e) => handleScoreChange(e, 15, "ws1")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="1">1 - Low</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws1.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws1}
                        onChange={(e) => handleCommentChange("ws1", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>2. Political Economy</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Political support and stakeholder alignment</small>
                    </td>
                    <td><span className="weight-badge">30%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws2}
                        onChange={(e) => handleScoreChange(e, 30, "ws2")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="1">1 - Low</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws2.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws2}
                        onChange={(e) => handleCommentChange("ws2", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>3. Project Efficiency</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Economic viability (EIRR analysis)</small>
                    </td>
                    <td><span className="weight-badge">15%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws3}
                        onChange={(e) => handleScoreChange(e, 15, "ws3")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="1">1 - Low</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws3.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws3}
                        onChange={(e) => handleCommentChange("ws3", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>4. Climate Risk & Resilience</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Climate change considerations</small>
                    </td>
                    <td><span className="weight-badge">10%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws4}
                        onChange={(e) => handleScoreChange(e, 10, "ws4")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - Carbon Positive</option>
                        <option value="3">3 - Carbon Neutral</option>
                        <option value="1">1 - Carbon Negative</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws4.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws4}
                        onChange={(e) => handleCommentChange("ws4", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>5. Gender & Equity</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Benefits across gender and vulnerable groups</small>
                    </td>
                    <td><span className="weight-badge">10%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws5}
                        onChange={(e) => handleScoreChange(e, 10, "ws5")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="1">1 - Low</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws5.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws5}
                        onChange={(e) => handleCommentChange("ws5", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>6. ESG Compliance</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Environmental, Social, Governance standards</small>
                    </td>
                    <td><span className="weight-badge">5%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws6}
                        onChange={(e) => handleScoreChange(e, 5, "ws6")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - No concerns</option>
                        <option value="3">3 - Minor issues</option>
                        <option value="1">1 - Significant issues</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws6.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws6}
                        onChange={(e) => handleCommentChange("ws6", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>7. Job Creation</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Number of new jobs from implementation</small>
                    </td>
                    <td><span className="weight-badge">10%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws7}
                        onChange={(e) => handleScoreChange(e, 10, "ws7")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - 500+ jobs</option>
                        <option value="3">3 - 250-500 jobs</option>
                        <option value="1">1 - &lt; 250 jobs</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws7.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws7}
                        onChange={(e) => handleCommentChange("ws7", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>8. Regional Balance</strong>
                      <br />
                      <small style={{ color: "#718096" }}>Geographic coverage and benefits</small>
                    </td>
                    <td><span className="weight-badge">5%</span></td>
                    <td>
                      <select
                        className="score-input"
                        value={selectedScores.ws8}
                        onChange={(e) => handleScoreChange(e, 5, "ws8")}
                      >
                        <option value="">--</option>
                        <option value="5">5 - National</option>
                        <option value="3">3 - Multiple regions</option>
                        <option value="1">1 - Single region</option>
                      </select>
                    </td>
                    <td><span className="weighted-score">{scores.ws8.toFixed(2)}</span></td>
                    <td>
                      <textarea
                        className="form-control comment-textarea"
                        placeholder="Add comments..."
                        value={comments.ws8}
                        onChange={(e) => handleCommentChange("ws8", e.target.value)}
                        rows="3"
                      />
                    </td>
                  </tr>
                  <tr style={{ background: "#f7fafc", fontWeight: 700 }}>
                    <td colSpan="2"><strong>TOTAL WEIGHTED SCORE</strong></td>
                    <td colSpan="2" style={{ fontSize: "24px", color: "#667eea" }}>
                      <span>{calculateTotalScore()}</span> / 5.00
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <div className="alert alert-success" style={{ marginTop: 25 }}>
                <span>✓</span>
                <div>
                  <strong>Strong Project Score:</strong> This project scores {calculateTotalScore()}/5.00 ({((parseFloat(calculateTotalScore()) / 5.00) * 100).toFixed(0)}%) and ranks highly for Stage 3 consideration.
                </div>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary">Save Progress</button>
                <button className="btn btn-primary">Submit Scores ➜</button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3 */}
        {activeScreen === "stage3" && (
          <div className="screen active">
            <div className="card">
              <h2>💰 Stage 3: Fiscal Space & MTEF Ceiling Analysis</h2>

              <div className="alert alert-info">
                <span>ℹ️</span>
                <div>
                  <strong>Purpose:</strong> Assess if projects fit within available development budget and MTEF ceilings for FY 2025/26
                </div>
              </div>

              <h3>Available Fiscal Space - FY 2025/26</h3>

              <div className="fiscal-comparison">
                <div className="fiscal-item">
                  <div className="fiscal-label">Total MTEF Ceiling for Development</div>
                  <div className="fiscal-value">UGX 8.5 Trillion</div>
                  <div className="fiscal-bar">
                    <div className="fiscal-bar-fill" style={{ width: "100%" }}>100%</div>
                  </div>
                </div>
                <div className="fiscal-item">
                  <div className="fiscal-label">Committed to Ongoing Projects</div>
                  <div className="fiscal-value">UGX 6.8 Trillion</div>
                  <div className="fiscal-bar">
                    <div className="fiscal-bar-fill" style={{ width: "80%" }}>80%</div>
                  </div>
                </div>
              </div>

              <div className="fiscal-comparison" style={{ marginTop: 20 }}>
                <div className="fiscal-item" style={{ border: "3px solid #48bb78" }}>
                  <div className="fiscal-label">Available for New Projects</div>
                  <div className="fiscal-value" style={{ color: "#48bb78" }}>UGX 1.7 Trillion</div>
                  <div className="fiscal-bar">
                    <div
                      className="fiscal-bar-fill"
                      style={{
                        width: "20%",
                        background: "linear-gradient(90deg, #48bb78 0%, #38a169 100%)",
                      }}
                    >
                      20%
                    </div>
                  </div>
                </div>
                <div className="fiscal-item">
                  <div className="fiscal-label">Requested by Top 30 Projects</div>
                  <div className="fiscal-value">UGX 2.1 Trillion</div>
                  <div className="fiscal-bar">
                    <div className="fiscal-bar-fill overfill" style={{ width: "100%" }}>
                      124% of Available
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning" style={{ marginTop: 25 }}>
                <span>⚠️</span>
                <div>
                  <strong>Budget Constraint:</strong> Requested funding exceeds available fiscal space by UGX 400 Billion. Sequencing required.
                </div>
              </div>

              <h3 style={{ marginTop: 40 }}>Top Ranked Projects vs. Fiscal Space</h3>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by project name, MDA, score, cost, or cumulative..."
                  value={stage3SearchTerm}
                  onChange={(e) => setStage3SearchTerm(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <table className="scoring-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Project</th>
                    <th>MDA</th>
                    <th>Score</th>
                    <th>Cost (UGX BN)</th>
                    <th>Cumulative</th>
                    <th>Fit in Budget?</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStage3Projects.map((project) => (
                    <tr key={project.rank} style={project.rowStyle}>
                      <td>
                        <span className={`rank-badge ${project.badgeType}`}>
                          {project.rank}
                        </span>
                      </td>
                      <td>{project.projectName}</td>
                      <td>{project.mda}</td>
                      <td>{project.score}</td>
                      <td>{project.cost}</td>
                      <td>{project.cumulative}</td>
                      <td>
                        <span className={`status-badge ${project.fitInBudgetType}`}>
                          {project.fitInBudget}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="alert alert-success" style={{ marginTop: 25 }}>
                <span>✓</span>
                <div>
                  <strong>Selection Decision:</strong> Top 7 projects (Ranks 1-7) fit within available fiscal space of UGX 1.7 Trillion. Projects ranked 8+ will be considered for FY 2026/27.
                </div>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary">Export Analysis</button>
                <button className="btn btn-primary">Confirm Selection ➜</button>
              </div>
            </div>
          </div>
        )}

        {/* Ranking */}
        {activeScreen === "ranking" && (
          <div className="screen active">
            <div className="card">
              <h2>🏆 Final Project Rankings - FY 2025/26</h2>

              <h3>Complete Project Rankings</h3>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by project name, MDA, score, or cost..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>

              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Project Name</th>
                    <th>MDA</th>
                    <th>Total Score</th>
                    <th>Cost (UGX BN)</th>
                    <th>Selection Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.rank} style={project.rowStyle}>
                      <td>
                        <span className={`rank-badge ${project.badgeType}`}>
                          {project.rank}
                        </span>
                      </td>
                      <td>{project.projectName}</td>
                      <td>{project.mda}</td>
                      <td><strong>{project.score}</strong></td>
                      <td>{project.cost}</td>
                      <td>
                        <span className={`status-badge ${project.statusType}`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="btn-group" style={{ marginTop: 30 }}>
                <button className="btn btn-secondary">📊 Export Full Report</button>
                <button className="btn btn-secondary">📧 Notify MDAs</button>
                <button className="btn btn-primary">Publish to PIP System ➜</button>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default IBPProjectSelection;

