import React from "react";
import "./ProjectSelectionModule.css";

const PrioritizeSelectedProjects = () => {
  return (
    <div className="ibp-wrapper">
      <div className="container-scrollable">
        <div className="container">
          <div className="screen active">
            <div className="card">
              <h2>🏆 Final Project Rankings - FY 2025/26</h2>

              <div className="alert alert-success">
                <span>✓</span>
                <div>
                  <strong>Selection Complete:</strong> 65 projects completed all stages. 42 projects selected for PIP inclusion based on scores and fiscal space.
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card success">
                  <div className="stat-value">42</div>
                  <div className="stat-label">Selected for PIP & Budget</div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-value">23</div>
                  <div className="stat-label">Ranked but Not Selected (Fiscal Constraint)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">UGX 1.68T</div>
                  <div className="stat-label">Total Budget Allocated</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">4.12</div>
                  <div className="stat-label">Average Score (Selected Projects)</div>
                </div>
              </div>

              <h3>Complete Project Rankings</h3>

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
                  <tr>
                    <td><span className="rank-badge gold">1</span></td>
                    <td>National Health Information System</td>
                    <td>Ministry of Health</td>
                    <td><strong>4.30</strong></td>
                    <td>85</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr>
                    <td><span className="rank-badge silver">2</span></td>
                    <td>Renewable Energy Grid Expansion</td>
                    <td>Ministry of Energy</td>
                    <td><strong>4.25</strong></td>
                    <td>320</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr>
                    <td><span className="rank-badge bronze">3</span></td>
                    <td>Agricultural Value Chain Development</td>
                    <td>Ministry of Agriculture</td>
                    <td><strong>4.15</strong></td>
                    <td>150</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr>
                    <td><span className="rank-badge">4</span></td>
                    <td>Digital Education Platform</td>
                    <td>Ministry of Education</td>
                    <td><strong>4.10</strong></td>
                    <td>95</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr>
                    <td><span className="rank-badge">5</span></td>
                    <td>Water Supply Infrastructure - Western</td>
                    <td>Ministry of Water</td>
                    <td><strong>4.05</strong></td>
                    <td>280</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr>
                    <td><span className="rank-badge">6</span></td>
                    <td>Urban Public Transport System</td>
                    <td>Ministry of Works</td>
                    <td><strong>3.95</strong></td>
                    <td>450</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr>
                    <td><span className="rank-badge">7</span></td>
                    <td>Tourism Infrastructure Development</td>
                    <td>Ministry of Tourism</td>
                    <td><strong>3.90</strong></td>
                    <td>180</td>
                    <td><span className="status-badge success">Selected - Code Assigned</span></td>
                  </tr>
                  <tr style={{ background: "#fff5f5" }}>
                    <td><span className="rank-badge">8</span></td>
                    <td>Regional Hospital Construction</td>
                    <td>Ministry of Health</td>
                    <td><strong>3.85</strong></td>
                    <td>380</td>
                    <td><span className="status-badge warning">Not Selected - Fiscal Space</span></td>
                  </tr>
                  <tr style={{ background: "#fff5f5" }}>
                    <td><span className="rank-badge">9</span></td>
                    <td>Industrial Park Development</td>
                    <td>Ministry of Trade</td>
                    <td><strong>3.80</strong></td>
                    <td>420</td>
                    <td><span className="status-badge warning">Not Selected - Fiscal Space</span></td>
                  </tr>
                  <tr style={{ background: "#fff5f5" }}>
                    <td><span className="rank-badge">10</span></td>
                    <td>ICT Infrastructure Upgrade</td>
                    <td>Ministry of ICT</td>
                    <td><strong>3.75</strong></td>
                    <td>125</td>
                    <td><span className="status-badge warning">Not Selected - Fiscal Space</span></td>
                  </tr>
                </tbody>
              </table>

              <div className="btn-group" style={{ marginTop: 30 }}>
                <button className="btn btn-secondary">📊 Export Full Report</button>
                <button className="btn btn-secondary">📧 Notify MDAs</button>
                <button className="btn btn-primary">Publish to PIP System ➜</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioritizeSelectedProjects;

