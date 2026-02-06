export default {
  resources: {
    parameters: {
      name: 'System Parameters'
    },
    trash: {
      name: 'Deleted Projects',
    },
    'reports-project-geo-by-phases': {
      name: 'Project Locations by Phases'
    },
    'reports-projects-repeated': {
      name: 'Repeated Projects'
    },
    'reports-projects-submitted': {
      name: 'Project submitted by the 7th of month'
    },
    'reports-projects-donors': {
      name: 'Donor Projects'
    },
    'reports-projects-stagnant': {
      name: 'Projects that are stagnant for 14 days'
    },
    'reports-projects-for-action': {
      name: 'Projects waiting for User action'
    },
    'reports-projects-for-pap': {
      name: 'Projects in PAP'
    },
    'reports-projects-categories': {
      name: 'Projects by Categories'
    },
    delegation: {
      name: 'User Delegation'
    },
    dashboard: {
      name: 'Dashboard'
    },
    "completed-report": {
      name: 'Completed Report'
    },
    "reports-projects-ranking": {
      name: "Ranking Report"
    },
    'reports-fiscal-load': {
      name: 'Fiscal Load'
    },
    'reports-project-cost-evaluation': {
      name: 'Cost Evolution Report'
    },
    'reports-project-count': {
      name: 'Projects Count by Programs'
    },
    'reports-project-ibp-usage': {
      name: 'IBP User Action Tracking Report'
    },
    'reports-project-dc-report': {
      name: 'DC Report'
    },
    'reports-pipeline-projects': {
      name: 'Projects in Pipeline',
    },
    'psip-report-view': {
      name: 'PSIP',
    },
    'project-managment': {
      name: 'Project Management',
    },
    'project-resources-managment': {
      name: 'Project Resource Management',
    },
    'me-report-view': {
      name: 'M&E Report',
    },
    'project-portfolio': {
      name: 'Project Porfolio',
    },
    'project-resources-management': {
      name: 'Project Resources Management',
    },
    'project-management': {
      name: 'Project Management',
    },
    programs: {
      name: 'Programs',
    },
    sub_programs: {
      name: 'Subprograms',
    },
    user_roles: {
      fields: {
        role_id: 'Role'
      }
    },
    votes: {
      name: 'Votes',
    },
    // roles: {
    //   name: 'Roles',
    //   fields: {
    //     name: 'Role Name',
    //     is_deleted: 'Is Deleted',
    //     permissions: 'permissions',
    //     organization_level: 'organization_level',
    //     has_allowed_projects: 'has_allowed_projects',
    //   },
    // },
    notifications: {
      name: 'Notifications',
      fields: {
        title_html: 'Subject',
        created_at: 'Date',
        sender: 'Sender',
        body_html: 'Message',
      },
    },
    dashboards: {
      projects_waiting: 'Projects Awaiting Your Decision',
      projects_phases: 'Projects by Phases',
      projects_groups: 'Groupped Projects',
      projects: 'Projects',
    },
    'report-builder': {
      name: 'Report Builder',
    },
    gantt: {
      name: 'Gantt Chart',
    },
    reports: {
      name: 'Reports',
      title: 'REPORTS',
      projects_by_location: 'Projects by Location',
      phases_title: 'Phases',
      filters: 'Organization filters',
      fiscal_load: 'Fiscal Load',
      cost_evolution: 'Evolution of Project Cost',
      projects_by_cycles: 'Projects at different stages of the Development Cycle (UGX)',
      projects_by_cycles_counts: 'Projects at different stages of the Development Cycle',
      no_data: 'No data available',
      loading: 'Data is loading, please wait ...',
      pipeline: {
        name: 'Pipeline of Projects',
        header: {
          id: 'ID',
          title: 'Title',
          cost: 'Cost of Investment',
          start_date: 'Proposed Start Date',
          duration: 'Duration',
          enter_date: 'Date of Feasibility',
        },
      },
      ranking: {
        name: 'Project Ranking',
        header: {
          rank: 'Rank',
          title: 'Title',
          cost: 'Cost (UGX)',
          // sector: 'Name of Sector',
          vote: 'Vote',
          npv: 'NPV (UGX)',
          enpv: 'ENPV (UGX)',
          fnpv: 'FNPV (UGX)',
          irr: 'IRR (%)',
          err: 'ERR (%)',
        },
      },
    },
    roles: {
      name: 'Roles',
      admin: 'Administrator',
      department_admin_user: 'Department Head',
      pap_commissioner_user: 'PAP Commissioner',
      pap_head_user: 'PAP Head',
      pap_standard_user: 'PAP Standard User',
      standard_user: 'Standard User',
      vote_admin_user: 'Head Planning',
      account_officer: 'Accounting officer',
      dc_member_user: 'DC member',
      sector_head_user: 'Vote Head',
      desk_officer_user: 'Desk Officer',
      donor_user: 'Donor',
      pap_senior_economist_user: 'PAP Senior Economist',
      pap_assist_commissioner_user: 'PAP Assistant Commissioner',
      fields: {
        name: 'Role',
        is_deleted: 'Is Deleted',
        permissions: 'permissions',
        organization_level: 'organization_level',
        has_allowed_projects: 'has_allowed_projects',
      },
    },
    projects: {
      name: 'Project |||| Projects',
      create: {
        title: 'Create Project',
        fill_required: 'Fill in the required fields below, then click Create Project to continue.',
        saving: 'Creating…',
        start_template: 'Create Project',
        created_continue: 'Project created. You can fill the remaining steps when ready.',
        error: 'Error creating project.',
      },
      fields: {
        phase: 'Phase',
        created_on: 'Submission Date',

        project_no: 'Project No',
        created_by: 'Created By',
        created_at: 'Submission Date',
        phase_id: 'Phase',
        status: 'Status',
        workflow_status: 'Workflow Step',
        'workflow.status': 'Workflow Step',
        title: 'Project Title',
        name: 'Project Title',
        sector_id: 'Vote',
        department_id: 'Sub Program Name',
        vote_id: 'Vote',
        program: {
          code: 'Program Code',
          name: 'Program Name',
        },
        fund: {
          code: 'Fund Code',
          name: 'Fund Name',
        },
        'fund-source': {
          code: 'Source of Fund Code',
          name: 'Source of Fund Name',
        },
        vote: {
          code: 'Vote Code',
          name: 'Vote Name',
        },
        vote_function: {
          code: 'Department Code',
          name: 'Department Name',
        },
        function: {
          code: 'Directorate Code',
          name: 'Directorate Name',
        },
        sub_program: {
          code: 'Sub Program Code',
          name: 'Sub Program Name',
        },
        department: {
          code: 'Department Code',
          name: 'Department Name',
        },
        sender: 'Sender',
      },
    },
    'project-details': {
      name: 'Project Details',
      fields: {
        intervention: 'Intervention',
        vote: 'Vote',
        classification: 'Project Classification',
        responsible_officers: {
          header: 'Responsible Officers',
          title: 'Officer Title',
          name: 'Officer Name',
          phone: 'Officer Phone',
          email: 'Officer Email',
          mobile_phone: 'Officer Mobile Phone',
          organization_name: 'Officer Organization Name',
          address: 'Officer Address',
        },
        name: 'Project Title',
        current_investment_ratio: 'Capital to Recurrent Ratio',
        title: 'Project Title',
        summary: 'Technical Description',
        start_date: 'Start Date',
        end_date: 'End Date',
        locations: 'Location',
        geo_location: 'Geo Location',
        estimated_lifetime: 'Estimated Lifetime',
        is_dlp: 'Project Has Defect Liability Period',
        liability_period: 'Defect Liability Period',
        is_omp: 'Project Has Operation & Maintenance Period',
        maintenance_period: 'Operation & Maintenance Period',
        om_cost: 'Operation & Maintenance Costs (O&M Costs, UGX)',
        om_fund_id: 'Fund Name',
        exec_management_plan: 'Executive Management Plan',
        exec_management_plan_pfs: 'Executive Summary',
        introduction: 'Introduction',
        implementing_agencies: 'Implementing Agencies',
        project_categories_id: 'Project Category',
        //background-form
        situation_analysis: 'Situation Analysis',
        situation_analysis_file: 'Situation Analysis Attachment',
        problem_statement: 'Problem Statement',
        problem_statement_file: 'Problem Statement Attachment',
        problem_cause: 'Problem Cause',
        problem_causes_file: 'Problem Causes Attachment',
        problem_effects: 'Problem Effects',
        problem_effects_file: 'Problem Effects Attachment',
        justification: 'Justification',
        sustainability_plan: 'Sustainability Plan',
        me_strategies: 'Monitoring and Evaluation Strategies',
        justification_file: 'Justification Attachment',
        evaluation_methodology: 'Evaluation Methodology',
        evaluation_period: 'Evaluation Period',
        achieved_outcomes: 'Achieved Outcomes',
        deviation_reasons: 'Deviation Reasons',
        measures: 'Measures',
        lessons_learned: 'Lessons Learned',
        is_evaluation: 'Project Requires Ex-Post Evaluation',
        government_agencies: {
          title: 'Coordination with Other Government Agencies',
          name: 'Name',
          description: 'Details',
        },
        government_coordinations: {
          title: 'Coordination with Other Government Agencies',
          name: 'Name',
          description: 'Details',
        },
        stakeholders: {
          title: 'Stakeholders and their responsibilities',
          name: 'Name',
          responsibilities: 'Responsibilities',
        },
        in_ndp: {
          title: 'In NDP',
          yes: 'National Development Plan',
          other: 'Other Strategic Documents',
        },
        ndp_type: {
          title: 'NDP Type',
          core: 'NDP Core Projects',
          priority: 'NDP Priority Area',
        },
        ndp_number: 'NDP Number',
        ndp_name: 'Project Name',
        ndp_page_no: 'Page in NDP',
        ndp_focus_area: {
          null: '',
          title: 'Focus Area',
          wealth_creation: 'Wealth Creation',
          inclusive_growth: 'Inclusive Growth',
          competitiveness: 'Competitiveness',
        },
        ndp_intervention: 'Intervention',
        ndp_strategic_directives: 'Other Strategic Directives',
        other_plans: {
          development_partners: 'Development partners',
          cabinet_directives: 'Cabinet directives',
          parliament_approval: 'Parliament approval',
          stare_owned_enterprise: 'Stare owned enterprise',
          regional_integration_policy: 'Regional integration policy',
          political_manifestos: 'Political manifestos',
          interest_groups_or_beneficiaries: 'Interest groups or beneficiaries',
          private_sponsors: 'Private sponsors',
          sustainable_development_goals: 'Sustainable development goals',
        },
        ndp_plan_details: 'Strategic Alignment Details',
        //--officer
        officer_title: 'Officer Title',
        officer_name: 'Officer Name',
        officer_phone: 'Officer Phone',
        officer_email: 'Officer Email',
        officer_mobile_phone: 'Officer Mobile Phone',
        //introduction
        rational_study: 'Rationale of the Study',
        methodology: 'Methodology',
        organization_study: 'Organisation of the PFS and FS',
        organization_study_pfs: 'Organisation of the Pre-feasibility Study',
        organization_study_fs: 'Organisation of the Feasibility Study',
        other_info: 'Project Additional Information',
        attachments: {
          title: 'Mandatory attachments',
          add: 'Add Attachment',
          remove: 'Remove Attachment',
        },

        benefits: 'Benefits',
        goal: 'Project Goal',
        commentaries: 'Commentaries',
        files: 'Project Files',
        //--demand_analys
        demand_analysis: 'Demand Analysis',
        demand_analysis_files: 'Demand Analysis Files',
        //
        pre_feasibility_cost: 'Pre-Feasibility Cost',
        pre_feasibility_consultants: 'Pre-Feasibility Consultants',
        strategic_analysis: 'Strategic Analysis',
        strategic_alignment: 'Strategic Alignment',
        //FinancialAnalysisForm
        financing_modality: 'Financing Modality',
        feasbility_cost: 'Feasibility Cost',
        feasibility_consultants: 'Feasibility Consultants',
        feasibility_funds_request: 'Feasibility Funds Request',
        env_impact_assessment: 'Environmental Impact Assessment',
        //modules
        technical_design: 'Technical Design',
        production_plan: 'Production Plan',
        hr_requirements: 'HR Requirements',
        legal_assessment: 'Legal Assessment',
        financial_evaluation: 'Financial/Private Evaluation',
        economic_evaluation: 'Economic/Social Evaluation',
        risk_evaluations: 'Risk Evaluation',
        distributional_assessment: 'Distributional Assessment',
        exec_management_plan: 'Executive Management Plan',
        exec_management_plan_pfs: 'Executive Summary',
        sustainability_assessment: 'Sustainability Assessment',
        //TechnicalApproachForm
        pcn_outcome: 'Outcomes',
        pcn_interventions: 'Interventions',
        interventions: 'Interventions',
        investments: 'Investment Costs',
        //--background
        in_ndpi: 'Already Existing in NDPI',
        in_ndpii: 'Already Existing in NDPII',
        in_mfped: 'Already Existing in MFPED PIP',
        strategic_other_plan: 'Strategic Other Plan',
        strategic_considerations: 'Other Strategic Considerations',
        strategic_fit: 'Strategic Fit',
        strategic_alignment: 'Strategic Alignment',
        baseline: 'Indicator Baseline Year',
        outcome_targets: 'Outcome Indicator Target Years',
        output_base: 'Output Indicator Baseline',
        output_targets: 'Output Indicator Target Years',
      },
    },
    organizations: {
      name: 'Organisation |||| Organisations',
      fields: {
        code: 'Organisation Code',
        name: 'Organisation Name',
      },
    },
    departments: {
      name: 'Sub Program |||| Sub Programs',
      fields: {
        code: 'Sub Program Code',
        name: 'Sub Program Name',
        organization_id: 'Organisation Name',
        vote_id: 'Vote',
        // sector_id: 'Sector',
      },
    },
    funds: {
      name: 'Fund |||| Funds',
      fields: {
        code: 'Fund Code',
        name: 'Fund Name',
      },
    },
    'fund-sources': {
      name: 'Source of Fund |||| Source of Funds',
      fields: {
        code: 'Source of Fund Code',
        name: 'Source of Fund Name',
        fund_id: 'Fund Name',
      },
    },
    votes: {
      name: 'Vote |||| Votes',
      fields: {
        code: 'Vote Code',
        name: 'Vote Name',
        // sector_id: 'Sector Name',
      },
    },
    'vote-functions': {
      name: 'Program Outcome|||| Program Outcomes',
      fields: {
        code: 'Program Code',
        name: 'Program Name',
        vote_id: 'Vote Name',
      },
    },
    // sectors: {
    //   name: 'Sector |||| Sectors',
    //   fields: {
    //     code: 'Sector Code',
    //     name: 'Sector Name',
    //   },
    // },
    outcomes: {
      name: 'Outcome |||| Outcomes',
      fields: {
        name: 'Outcome Title',
      },
      actions: {
        create: 'Create Outcome',
        edit: 'Manage Indicators',
      },
    },
    outputs: {
      name: 'Output |||| Outputs',
      fields: {
        outcome_ids: 'Outcomes',
        name: 'Output Title',
        description: 'Output Description',
        tech_specs: 'Technical Specifications',
        alternative_specs: 'Alternative Specifications',
        vote_id: 'Output Votes',
        output_value: 'Output Quantity',
        unit_id: 'Unit',
        investments: {
          name: 'Outputs Investments',
          fields: {
            fund_id: 'Fund',
            fund_source_id: 'Fund sources',
            total: 'Total',
            cost_classification_id: 'Cost Classification',
            cost_category_id: 'Cost Category',
          },
          actions: {
            edit: 'Estimated Cost',
          },
        },
      },
      actions: {
        create: 'Create Output',
        edit: 'Manage Indicators',
        editCosts: 'Estimated Cost',
      },
    },
    indicators: {
      name: 'Indicator |||| Indicators',
      fields: {
        name: 'Indicator Name',
        baseline: 'Baseline',
        verification_means: 'Verification Means',
        assumptions: 'Assumptions',
        risk_factors: 'Risk Factors',
        target: 'Target',
      },
    },
    phases: {
      name: 'Phase Name',
      phase_1: 'Project Concept',
      phase_2: 'Project Profile',
      phase_3: 'Pre-feasibility',
      phase_4: 'Feasibility',
      phase_5: 'Project Proposal',
      phase_6: 'Budget Appropriation',
      phase_7: 'Implementation',
      phase_8: 'Ex-Post Evaluation',
    },
    breadcrumbs: {
      phase_1: 'Profile',
      phase_2: 'Profile',
      phase_3: 'Pre-feasibility',
      phase_4: 'Feasibility',
      phase_5: 'Proposal',
      phase_6: 'Budget Appropriation',
      phase_7: 'Implementation',
      phase_8: 'Ex-Post Evaluation',
    },
    'project-categories': {
      name: 'Project Category |||| Project Categories',
      fields: {
        project_categories_id: 'Project Category Id',
        title: 'Project Category Title',
        last_phase_id: 'Last Phase',
      },
    },
    activities: {
      name: 'Activity |||| Activities',
      fields: {
        name: 'Activity Name',
        start_date: 'Start date',
        end_date: 'End date',
        description: 'Activity Description',
        output_ids: 'Activity Outputs',
        vote_id: 'Activity Votes',
        investments: {
          name: 'Activities Investments',
          fields: {
            fund_id: 'Fund',
            fund_source_id: 'Fund sources',
            total: 'Total',
            cost_classification_id: 'Cost Classification',
            cost_category_id: 'Cost Category',
          },
          actions: {
            edit: 'Estimated Cost',
          },
        },
      },
    },
    project_options: {
      name: 'Options Analysis',
      fields: {
        title: 'Title',
        description: 'Description',
        cost: 'Cost (UGX)',
        score: 'Total Score',
        funding_modality: {
          title: 'Preferred funding modality',
          title_pfs: 'Preferred Implementation modality',
          PROCUREMENT: 'Traditional procurement',
          procurement: 'Traditional procurement',
          PARTNERSHIP: 'Public private partnership',
          partnership: 'Public private partnership',
        },
        is_preferred: 'Preferred Alternative',
        justification: 'Justification of the Preferred Alternative',
        modality_justification: 'Justification for the Preferred Funding Modality',
        modality_justification_pfs: 'Justification for the Preferred Implementation Modality',
        stepper: {
          description: 'Description',
          building_blocks: 'Building Blocks',
          analytical_modules: 'Analytical Modules',
          best_option: 'Preferred Alternative Selection',
        },
        building_blocks: {
          title: 'Building Blocks',
          description: 'Description',
          advantage: 'Advantages',
          disadvantage: 'Disadvantages',
          score: 'Score',
          modules: {
            demand_module: 'Demand Analysis',
            technical_module: 'Technical & Engineering',
            environmental_module: 'Environmental',
            hr_module: 'HR requirements',
            legal_module: 'Legal assessment',
          },
          demand_module: {
            present_supply: 'Current Supply',
            present_demand: 'Current Demand',
            deficit: 'Deficit',
            demand_projections: 'Demand Projections',
          },
        },
        analytical_modules: {
          title: 'Analytical Modules',
          description: 'Description',
          advantage: 'Advantages',
          disadvantage: 'Disadvantages',
          score: 'Score',
          appraisal_methodology: {
            title: 'Appraisal Methodology',
            cea: 'CEA',
            cba: 'CBA',
          },
          financial_evaluation: {
            fnpv: 'FNPV (UGX bln.)',
            irr: 'IRR %',
            summary: 'Financial Analysis Details',
          },
          economic_evaluation: {
            enpv: 'ENPV (UGX bln.)',
            err: 'ERR %',
            summary: 'Economical Analysis Details',
          },
          criterias: {
            title: 'Cost Effectiveness Results',
            criteria_title: 'Title',
            criteria_value: 'Value',
            measure_unit: 'Measure unit',
          },
          stakeholder_evaluations: {
            name: 'Identity of the Stakeholder',
            description: 'Description',
            impact_sign: {
              title: 'Impact',
              positive: 'Positive',
              negative: 'Negative',
            },
            beneficiary: {
              title: 'Relation',
              direct: 'Direct',
              indirect: 'Indirect',
            },
          },
          risk_evaluations: {
            description: 'Description',
            occurrence: 'Likelihood of Occurrence',
            impact: 'Impact',
            levels: {
              low: 'Low',
              medium: 'Medium',
              high: 'High',
              very_high: 'Very High',
            },
            mitigation_plan: 'Mitigation Plan',
          },
          modules: {
            financial: 'Financial',
            economic: 'Economic',
            distributional: 'Distributional',
            risk: 'Risk',
          },
        },
        summary: {
          title: 'Analysis of Alternatives Summary',
        },
      },
    },
    risk_factors: {
      name: 'Risk Factor |||| Risk Factors',
      fields: {
        risk_level: 'Risk Level',
        measures: 'Measures',
        risk_description: 'Risk Description',
      },
    },
    'file-types': {
      name: 'File Type |||| File Types',
      fields: {
        is_required: 'Is Required',
        phase_ids: 'Project Phases',
        name: 'File Type Name',
      },
    },
    users: {
      name: 'User Management',
      fields: {
        username: 'Username',
        email: 'E-mail',
        fullname: 'Full Name',
        phone: 'Phone',
        vote_id: 'Vote',
        role: 'Role',
        password_hash: 'Password',
        department_id: 'Sub Program Name',
        management_id: 'Name of Management',
        // sector_id: 'Name of Sector',
        // sector_ids: 'Name of Sectors',
        donor_id: 'Donors Name',
        user_roles: 'User Roles',
        roles: 'Roles',
        role_id: 'User Role',
        allowed_organization_ids: 'Allowed Organizations',
        allowed_project_ids: 'Access to Other Projects (optional)',
      },
    },
    locations: {
      name: 'Location Name',
    },
    costings: {
      name: 'Costing Classification Name',
    },
    fund_sources: {
      name: 'Funds Classification Name',
    },
    cost_classifications: {
      name: 'Costing Classification Name',
    },
    cost_categories: {
      name: 'Cost Categories |||| Cost Categories',
    },
    'cost-classifications': {
      name: 'Cost Classification |||| Cost Classifications',
      fields: {
        code: 'Code',
        name: 'Name',
        cost_category_id: 'Cost Category',
      },
    },
    'workflow-chart': {
      name: 'Workflow Name',
    },
    workflows: {
      name: 'Workflow Name',
    },
    'currency-rates': {
      name: 'Currency Rate Name',
    },
    units: {
      name: 'Unit Name',
    },
    currencies: {
      name: 'Currency Name',
    },
    'cost-categories': {
      name: 'Cost Categories |||| Cost Categories',
      fields: {
        code: 'Code',
        name: 'Name',
        expenditure_type: 'Expenditure Type',
      },
    },
    'me-reports': {
      name: 'M&E Report',
      fields: {
        quarter: 'Quarter',
        year: 'Year',
        data_collection_type: 'Data Collection Type',
        me_outputs: 'Outputs',
        unit: 'Output Unit',
        output_progress: 'Output Progress',
        output_value: 'Planned Output Quantity',
        indicators: 'Indicators',
        target: 'Achieved Target',
        planned_target: 'Planned Target',
        me_activities: 'Activities',
        status: 'Status',
        expected_completion_date: 'Expected Completion Date',
        challenges: 'Challenges',
        measures: 'Measures',
        allocation_challenges: 'Allocation Challenges',
        budget_appropriation: 'Budget Appropriation',
        allocation_measures: 'Allocation Measures',
        financial_execution: 'Financial Execution',
        execution_challenges: 'Execution Challenges',
        execution_measures: 'Execution Measures',
        next_budget_appropriation: 'Next Budget Appropriation',
        me_releases: 'Releases',
        type: 'Type',
        government: 'Government',
        donor: 'Donor',
        budget_allocation: 'Budget Allocation',
        me_type: 'Type of M&E activity',
      },
    },
    investments: {
      fields: {
        target: 'Target'
      }
    }
  },
};
