import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../constants/config";
import { TOKEN } from "../../../constants/auth";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BuildIcon from "@mui/icons-material/Build";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningIcon from "@mui/icons-material/Warning";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import { 
  Card, 
  CardContent, 
  IconButton, 
  Typography, 
  Box, 
  Container,
  Grid,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";

// Helper function to get cached PBS data
const getCachedPbsData = () => {
  const cacheKey = 'pbsProjectsData';
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
  
  if (cachedData && cacheTimestamp) {
    const now = Date.now();
    const cacheAge = now - parseInt(cacheTimestamp);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (cacheAge < fiveMinutes) {
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.warn('Failed to parse cached PBS data:', error);
      }
    }
  }
  return null;
};

// Fetch PBS data (same as implementation module list)
const fetchPbsData = async () => {
  const cacheKey = 'pbsProjectsData';
  
  // Check cache first
  const cachedData = getCachedPbsData();
  if (cachedData) {
    return cachedData;
  }

  try {
    // First, get access token
    const loginResponse = await axios.post(
      "https://pbsopenapi.finance.go.ug/graphql",
      {
        query: `
          mutation {
            login(
              data: {
                User_Name: "Nita",
                Password: "Nita1290W",
                ipAddress: "192.168.5.0"
              }
            ) {
              access_token
              refresh_token
            }
          }
        `,
      },
      {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
      }
    );

    const accessToken = loginResponse.data.data.login.access_token;

    // Then fetch the PBS data
    const dataResponse = await axios.post(
      "https://pbsopenapi.finance.go.ug/graphql",
      {
        query: `
          query {
            cgIbpProjectBudgetAllocations {
              Vote_Code
              Vote_Name
              Programme_Code
              Programme_Name
              SubProgramme_Code
              SubProgramme_Name
              Sub_SubProgramme_Code
              Sub_SubProgramme_Name
              Project_Code
              Project_Name
              Budget_Output_Code
              Budget_Output_Description
              Item_Code
              Description
              GoU
              ExtFin
              AIA
              GoUArrears
              BudgetStage
              Fiscal_Year
            }
          }
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 60000,
        withCredentials: false,
      }
    );

    const fetchedData = dataResponse.data.data.cgIbpProjectBudgetAllocations;
    
    // Remove duplicates based on Project_Code
    const seen = new Set();
    const uniqueData = fetchedData.filter((item) => {
      if (seen.has(item.Project_Code)) {
        return false;
      }
      seen.add(item.Project_Code);
      return true;
    });
    
    // Cache the data with timestamp
    localStorage.setItem(cacheKey, JSON.stringify(uniqueData));
    localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
    
    return uniqueData;
  } catch (error) {
    console.error("Error fetching PBS data:", error);
    return [];
  }
};

const CostedAnnualizedPlan = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [projectData, setProjectData] = useState({
    code: id || 'N/A',
    title: 'Loading...',
    start_date: 'N/A',
    status: 'N/A',
    phase: 'N/A'
  });
  const [loading, setLoading] = useState(false);

  const fetchProjectData = useCallback(async (projectCode) => {
    setLoading(true);
    try {
      // Fetch PBS data (will use cache if available)
      const pbsProjects = await fetchPbsData();
      
      // Find the specific project by code
      const projectPbsData = pbsProjects.find(item => item.Project_Code === projectCode);
      
      if (projectPbsData) {
        // Transform to match the same structure as the list page
        setProjectData({
          code: projectPbsData.Project_Code || projectCode,
          title: projectPbsData.Project_Name || 'Project Title Not Available',
          start_date: '2024-01-15', // Default date (same as list page)
          status: 'Approved',
          phase: 'Implementation'
        });
      } else {
        // If not found in PBS, set defaults
        setProjectData({
          code: projectCode,
          title: 'Project Title Not Available',
          start_date: 'N/A',
          status: 'N/A',
          phase: 'N/A'
        });
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      // Set defaults on error
      setProjectData({
        code: projectCode,
        title: 'Project Title Not Available',
        start_date: 'N/A',
        status: 'N/A',
        phase: 'N/A'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch project data from PBS API if not in navigation state
  useEffect(() => {
    // If project data is already in navigation state, use it
    if (location.state?.projectData) {
      setProjectData(location.state.projectData);
      return;
    }

    // Otherwise, fetch from PBS API using the project code
    if (id) {
      fetchProjectData(id);
    }
  }, [id, fetchProjectData, location.state]);

  const cards = [
    { 
      id: 1, 
      title: "Cost Annualised Plan", 
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#3F51B5" }} />,
      description: "Financial planning and budget allocation",
      color: "#E3F2FD"
    },
    { 
      id: 2, 
      title: "Project Management Tool Kit", 
      icon: <BuildIcon sx={{ fontSize: 40, color: "#4CAF50" }} />,
      description: "Tools and resources for project management",
      color: "#E8F5E8"
    },
    { 
      id: 3, 
      title: "Multiyear Commitments (MYC)", 
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: "#FF9800" }} />,
      description: "Long-term financial commitments and planning",
      color: "#FFF3E0"
    },
    { 
      id: 4, 
      title: "Appeal Change Request", 
      icon: <RequestQuoteIcon sx={{ fontSize: 40, color: "#F44336" }} />,
      description: "Request changes and modifications",
      color: "#FFEBEE"
    },
    { 
      id: 5, 
      title: "Risk Assessment", 
      icon: <WarningIcon sx={{ fontSize: 40, color: "#FF5722" }} />,
      description: "Identify and assess project risks",
      color: "#FFF8E1"
    },
    { 
      id: 6, 
      title: "Stakeholder Engagement", 
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#9C27B0" }} />,
      description: "Manage stakeholder relationships",
      color: "#F3E5F5"
    },
    { 
      id: 7, 
      title: "Human Resources Management", 
      icon: <PersonIcon sx={{ fontSize: 40, color: "#607D8B" }} />,
      description: "Manage project team and resources",
      color: "#ECEFF1"
    },
  ];

  const cardStyles = {
    height: "200px",
    position: "relative",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    },
  };

  const editButtonStyles = {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    opacity: 0,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 1)",
      transform: "scale(1.1)",
    },
  };

  // Function to handle "edit" button click and navigate to the appropriate page
  const handleEditClick = async (cardId) => {
    if (cardId === 1) {
      // Cost Annualised Plan card - navigate to cost-annualised-plan-form route
      history.push(`/implementation-module/${id}/cost-annualised-plan-form`, {
        state: {
          projectData: projectData
        }
      });
    } else if (cardId === 3) {
      // MYC card - navigate to myc-form route with project ID and data
      history.push(`/implementation-module/${id}/myc-form`, {
        state: {
          projectData: projectData
        }
      });
    } else if (cardId === 4) {
      // Appeal Change Request card - navigate to change-request-form route
      history.push(`/implementation-module/${id}/change-request-form`, {
        state: {
          projectData: projectData
        }
      });
    } else if (cardId === 5) {
      // Risk Assessment card - navigate to risk assessment form
      try {
        let projectDetailId = null;
        
        // First, try to get project_detail_id from location.state if available
        if (location.state?.projectData?.id) {
          projectDetailId = location.state.projectData.id;
        } else {
          // Try to find project_detail_id by querying the backend
          const token = localStorage.getItem(TOKEN);
          if (token) {
            try {
              // First, find the project by budget_code (PBS code)
              const projectsResponse = await axios.get(`${API_URL}/projects`, {
                headers: { 
                  Authorization: `Bearer ${token}`, 
                  'Content-Type': 'application/json' 
                },
                params: { 
                  per_page: 100, 
                  filter: JSON.stringify({ budget_code: id }) 
                },
              });
              
              const projects = projectsResponse.data?.data || projectsResponse.data || [];
              
              if (projects.length > 0) {
                const project = projects[0];
                if (project.id) {
                  // Then find the project_detail by project_id
                  const projectDetailsResponse = await axios.get(`${API_URL}/project-details`, {
                    headers: { 
                      Authorization: `Bearer ${token}`, 
                      'Content-Type': 'application/json' 
                    },
                    params: { 
                      per_page: 100, 
                      filter: JSON.stringify({ project_id: project.id }) 
                    },
                  });
                  
                  const projectDetails = projectDetailsResponse.data?.data || projectDetailsResponse.data || [];
                  
                  if (projectDetails.length > 0) {
                    projectDetailId = projectDetails[0].id;
                  }
                }
              }
            } catch (error) {
              console.error('Error finding project_detail_id for Risk Assessment:', error);
              // Continue with id as fallback
            }
          }
        }
        
        // Use the found project_detail_id, or fall back to the id (PBS code)
        const finalProjectDetailId = projectDetailId || id;
        
        history.push(`/risk-evaluations/${finalProjectDetailId}/create`, {
          state: { projectData: projectData }
        });
      } catch (error) {
        console.error('Error navigating to Risk Assessment form:', error);
        // Fallback: navigate with the id (PBS code) as project_detail_id
        history.push(`/risk-evaluations/${id}/create`, {
          state: { projectData: projectData }
        });
      }
    } else if (cardId === 6) {
      // Stakeholder Engagement card - navigate to stakeholder engagement form
      try {
        let projectDetailId = null;
        
        // First, try to get project_detail_id from location.state if available
        if (location.state?.projectData?.id) {
          projectDetailId = location.state.projectData.id;
        } else {
          // Try to find project_detail_id by querying the backend
          const token = localStorage.getItem(TOKEN);
          if (token) {
            try {
              // First, find the project by budget_code (PBS code)
              const projectsResponse = await axios.get(`${API_URL}/projects`, {
                headers: { 
                  Authorization: `Bearer ${token}`, 
                  'Content-Type': 'application/json' 
                },
                params: { 
                  per_page: 100, 
                  filter: JSON.stringify({ budget_code: id }) 
                },
              });
              
              const projects = projectsResponse.data?.data || projectsResponse.data || [];
              
              if (projects.length > 0) {
                const project = projects[0];
                if (project.id) {
                  // Then find the project_detail by project_id
                  const projectDetailsResponse = await axios.get(`${API_URL}/project-details`, {
                    headers: { 
                      Authorization: `Bearer ${token}`, 
                      'Content-Type': 'application/json' 
                    },
                    params: { 
                      per_page: 100, 
                      filter: JSON.stringify({ project_id: project.id }) 
                    },
                  });
                  
                  const projectDetails = projectDetailsResponse.data?.data || projectDetailsResponse.data || [];
                  
                  if (projectDetails.length > 0) {
                    projectDetailId = projectDetails[0].id;
                  }
                }
              }
            } catch (error) {
              console.error('Error finding project_detail_id for Stakeholder Engagement:', error);
              // Continue with id as fallback
            }
          }
        }
        
        // Use the found project_detail_id, or fall back to the id (PBS code)
        const finalProjectDetailId = projectDetailId || id;
        
        history.push(`/stakeholder-engagements/${finalProjectDetailId}/create`, {
          state: { projectData: projectData }
        });
      } catch (error) {
        console.error('Error navigating to Stakeholder Engagement form:', error);
        // Fallback: navigate with the id (PBS code) as project_detail_id
        history.push(`/stakeholder-engagements/${id}/create`, {
          state: { projectData: projectData }
        });
      }
    } else if (cardId === 7) {
      // Human Resources Management card - navigate to human resource form
      try {
        let projectDetailId = null;
        
        // First, try to get project_detail_id from location.state if available
        if (location.state?.projectData?.id) {
          projectDetailId = location.state.projectData.id;
        } else {
          // Try to find project_detail_id by querying the backend
          const token = localStorage.getItem(TOKEN);
          if (token) {
            try {
              // First, find the project by budget_code (PBS code)
              const projectsResponse = await axios.get(`${API_URL}/projects`, {
                headers: { 
                  Authorization: `Bearer ${token}`, 
                  'Content-Type': 'application/json' 
                },
                params: { 
                  per_page: 100, 
                  filter: JSON.stringify({ budget_code: id }) 
                },
              });
              
              const projects = projectsResponse.data?.data || projectsResponse.data || [];
              
              if (projects.length > 0) {
                const project = projects[0];
                if (project.id) {
                  // Then find the project_detail by project_id
                  const projectDetailsResponse = await axios.get(`${API_URL}/project-details`, {
                    headers: { 
                      Authorization: `Bearer ${token}`, 
                      'Content-Type': 'application/json' 
                    },
                    params: { 
                      per_page: 100, 
                      filter: JSON.stringify({ project_id: project.id }) 
                    },
                  });
                  
                  const projectDetails = projectDetailsResponse.data?.data || projectDetailsResponse.data || [];
                  
                  if (projectDetails.length > 0) {
                    projectDetailId = projectDetails[0].id;
                  }
                }
              }
            } catch (error) {
              console.error('Error finding project_detail_id for Human Resources:', error);
              // Continue with id as fallback
            }
          }
        }
        
        // Use the found project_detail_id, or fall back to the id (PBS code)
        const finalProjectDetailId = projectDetailId || id;
        
        history.push(`/human-resources/${finalProjectDetailId}/create`, {
          state: { projectData: projectData }
        });
      } catch (error) {
        console.error('Error navigating to Human Resources form:', error);
        // Fallback: navigate with the id (PBS code) as project_detail_id
        history.push(`/human-resources/${id}/create`, {
          state: { projectData: projectData }
        });
      }
    } else {
      // Other cards - self redirect (stay on same page)
      // You can add any visual feedback or state changes here if needed
      console.log(`Card ${cardId} clicked - staying on current page`);
      
      // Optional: Add visual feedback or state changes
      // For example, you could show a modal, update UI state, etc.
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton 
            onClick={() => history.push("/implementation-module")}
            sx={{ 
              mr: 2, 
              backgroundColor: "#f5f5f5",
              "&:hover": { backgroundColor: "#e0e0e0" }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
            {projectData.title}
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Chip 
            label={`Project Code: ${projectData.code}`} 
            color="primary" 
            variant="outlined"
            sx={{ fontWeight: "bold" }}
          />
          <Chip 
            label={projectData.phase || "Implementation Phase"} 
            color="success" 
            sx={{ fontWeight: "bold" }}
          />
          <Chip 
            label={projectData.status || "Active"} 
            color="info" 
            sx={{ fontWeight: "bold" }}
          />
        </Box>
        
        <Typography variant="body1" sx={{ color: "#7f8c8d", mt: 0.5 }}>
          Manage and monitor project implementation activities
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Cards Grid */}
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <Card
              sx={{
                ...cardStyles,
                backgroundColor: card.color,
                "&:hover .edit-button": {
                  opacity: 1,
                },
              }}
            >
              <CardContent sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                textAlign: "center",
                p: 3
              }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: "bold", 
                    color: "#2c3e50",
                    mb: 1,
                    fontSize: "1.1rem"
                  }}
                >
                  {card.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{ 
                    color: "#7f8c8d",
                    fontSize: "0.875rem",
                    lineHeight: 1.4
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
              
              <IconButton
                className="edit-button"
                sx={{ ...editButtonStyles }}
                aria-label="edit"
                onClick={() => handleEditClick(card.id)} 
              >
                <EditIcon sx={{ color: "#3F51B5" }} />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CostedAnnualizedPlan;
