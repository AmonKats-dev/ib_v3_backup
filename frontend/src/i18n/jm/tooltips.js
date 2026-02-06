export default {
  tooltips: {
    notifications: 'Notifications',
    help: 'Help',
    user_actions: 'User actions',
    resources: {
      locations: {
        fields: {
          central: 'Select Project Location Parish',
          province: 'Select Project Location Constituency',
        }
      },
      'ndp-strategies': {
        fields: {
          name: 'Input Strategy Name',
          ndp_goal_id: 'Select NDP Goal to filter NDP Outcomes',
          ndp_outcome_id: 'Select NDP Outcomes for Strategy'
        }
      },
      'ndp-outcomes': {
        fields: {
          name: 'Input Outcome Name',
          ndp_goal_id: 'Select NDP Goal for Outcome',
        }
      },
      'ndp-sdgs': {
        fields: {
          name: 'Input SDG Name',
          ndp_goal_id: 'Select NDP Goal to filter NDP Outcomes',
          ndp_outcome_ids: 'Select NDP Outcomes for SDG'
        }
      },
      'ndp-goals': {
        fields: {
          name: 'Input Goal Name',
        }
      },
      'me-reports': {
        name: 'M&E Report',
        fields: {
          quarter: 'Quarter',
          year: 'Year',
          data_collection_type: 'Data Collection Type',
          me_outputs: 'Outputs',
          output_progress: 'Output Progress',
          indicators: 'Indicators',
          target: 'Target',
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
      roles: {
        fields: {
          name: 'Role Name',
          is_deleted: 'Is Deleted',
          permissions: 'permissions',
          organization_level: 'organization_level',
          has_allowed_projects: 'has_allowed_projects',
        },
      },
      om_costs: {
        om_fund_id: 'Select the fund name from which the operation and maintenance cost will be obtained from.',
        om_fund_source_id: 'Select the source from where the operation and maintenance cost will be got from',
        om_cost_category_id: 'Select the cost category of the expense',
        om_cost_classification_id: 'Select the cost classification of the expense',
        om_years: 'Identify the amounts that will be spent for each financial year.',
      },
      reports: {
        projects_by_location_help: 'Turn on/off selectors to filter projects showed on geo map',
        projects_by_location_filters: 'Select Sector or Vote to filter projects showed on geo map',
      },
      projects: {
        fields: {
          program: 'Select the program under which this project is classified.',
          project_no:
            'A unique project identification number that can be used to track the project throughout its lifecycle.',
          created_by: 'User that created project',
          created_at: 'Submission Date',
          phase_id: 'Phase of the project.',
          status: 'Status of the project.',
          'workflow.status': 'Workflow Step',
        },
      },
      'project-details': {
        fields: {
          name: 'Enter a clear project title, avoiding duplication of names within the Public Investment Plan.',
          output_agencies: 'Identify the implementing agencies for the output',
          ndp_mtfs_id: 'Identify the MTF which the project is aligned',
          ndp_sdgs_id: 'Identify the SDG which the project is aligned',
          function: 'Function',
          sub_function: 'Sub Function',
          program: 'Program',
          sub_program: 'Sub Program',
          stakeholders_consultation: 'Identify the key stakeholders of the proposed project and outline the nature and extent of consultation undertaken and/or to be undertaken with all interested parties/stakeholders, including those who will be affected by the project, as well as those who need to make inputs into the project. Indicate the outcomes of consultations already undertaken.',
          ppp_similar_reference: 'Has a similar project been implemented by the private sector utilising a PPP modality locally, regionally or globally? If so, kindly include references.',
          ppp_interest: 'Have you had any discussions with or received any proposals or expressions of interest from any private sector party in developing this project concept? If so, please provide further information on the nature of interest',
          ppp_impediments: 'Are there any legal, social, environmental, technical or financial impediments to private sector involvement in the development of this project concept? If so, please explain.',
          ppp_risk_allocation: 'Provide a high level allocation of risk and function/responsibilities between the private sector and the GOJ in a PPP arrangement.',
          financial_pattern_type: 'Financial Pattern Type',
          financial_pattern_subtype: 'Financial Pattern Sub-Type',
          fund_body_type: 'Fund Type',
          proposed_fund_source: 'Proposed Funding Source',


          is_evaluation: 'Is Evaluation',
          ndp_compliance: 'Indicate how this project fits within the organizational mandate and/or satisfies relevant statutes.',
          ndp_policy_alignment: 'To which GOJ policy or policies is this project contributing?',
          ndp_sustainable_goals: 'state the SDG goals to which the project is directly contributing',
          ndp_strategy_id: 'Identify the National Strategy to which the project is aligned',
          ndp_outcome_id: 'Identify the Outcome to which the project is aligned',
          ndp_goal_id: 'Identify the goal to which the project is aligned',

          fund: 'Fund',
          cost_detail_sub_object: 'Cost Detail Sub Object',
          cost_sub_object: 'Cost Sub Object',
          cost_object: 'Cost Object',
          cost_class: 'Cost Class',

         
          climate_risks: {
            climate_hazard: 'Select the Climate Risk Events/Hazards that are likely to occur in the project area now & in the future.',
            vulnerability_impact: 'Describe the main area of medium & high vulnerability of the project and indicate proposed adaptation action(s) to be implemented in this project in order to minimize negative climate change impacts. ',
            overall_risk: 'What is the overall Climate Risk profile of the project for each climate hazard?',
            vulnerability_risk: `Assess the Vulnerability  of the Project - How significant would the damage to the project be, if any of the climate risk events (hazards) occurred? (High, Medium, Low). Vulnerability is Low: Project not affected by a particular hazard; Medium: Project is somewhat vulnerable to particular hazard; High: Project is very vulnerable to a particular hazard. `,
            exposure_risk: `What’s the likelihood of these various climate risk events/hazards occurring in the future? Exposure is: Low - If natural hazards are not likely to occur during construction and/or operation of the project.
            Medium - If the hazard is likely to occur at least once during the implementation and/or the operation of the project. High - If hazards may occur several times during the implementation and/or the operation of the project
            `
          },
          project_risks: {
            score: 'Score',
            probability: 'Select the probability of occurrence of the risk',
            impact_level: 'Select the impact level of risk on the project',
            title: 'Identify the significant risk that may prevent the project from achieving its objective. ',
            name: 'Identify the significant risk that may prevent the project from achieving its objective. ',
            owner: 'Identify the entity of responsible ',
            response: "Identify and generate guidance on how to reduce the exposure of the risk through different contractual clauses",

          },
          governance: 'Outline how the project is structured and the levels of decision making – the roles and responsibilities of the project steering committee, the project manager, and other key technical team members, and the main stakeholders. The members of the Project Steering Committee and the proposed senior officer to function as chairperson should be indicated. A chart should be added to summarize the requirement.',
          ministry: 'This is the entity with ultimate policy governance responsibility for the initiative',
          public_body: 'These are statutory bodies, Government companies and Institutions.',
          procurement_modality: 'Identify the likely methodology to be used by the project.',
          revenue_source: 'Identify the projects source of financing',
          sector: 'This is the entity with ultimate policy governance responsibility for the initiative',
          vote: 'These are statutory bodies, Government companies and Institutions.',
          central: 'Parish',
          classification: 'Project Classification',
          responsible_officers: {
            title: 'Officer Title',
            name: 'Officer Name',
            phone: 'Officer Phone (i.e. (876)9292732)',
            email: 'Officer Email',
            mobile_phone: 'Officer Mobile Phone (i.e. (876)9292732)',
            organization_name: 'Officer Organization Name',
            address: 'Officer Address',
          },
          current_investment_ratio: 'Capital to Recurrent Ratio',
          name: 'Let it be as clear as possible, avoiding duplication of names within the Public Investment Plan',
          title: 'Let it be as clear as possible, avoiding duplication of names within the Public Investment Plan',
          summary: 'Describe the current situation (i.e. what needs to change (problem statement). State what was done previously (if anything was done) to address the problem and actions that have been taken to date). What will happen if the project does not proceed contrasted with what will happen if the project proceeds? Include any research data to support the case being made.',
          start_date: 'Indicate the financial year in when the project is expected to commence.',
          end_date: 'The expected date of the project completion date',
          duration: 'Estimate the project construction period.',
          location: 'Precisely identify all the districts where the project will be located.',
          geo_location: 'Geo Location',
          province: "Constituency",
          estimated_lifetime:
            'Operational life of the project after construction is completed. A typical operational lifetime of infrastructure project range from 10 to 25 years.',
          is_dlp: 'Select if the project has a defect liability period.',
          liability_period: 'Defect Liability Period of the project. Enter number of years.',
          is_omp: 'Select if the project has operation and maintenance period',
          evaluation_period: 'Number of years after project completion',
          maintenance_period:
            'Operational life of the project after construction is completed. A typical operational lifetime of infrastructure project range from 10 to 25 years.',
          introduction: 'Introduction',
          implementing_agencies: 'These are statutory bodies, Government companies and Institutions.',
          executing_agencies: 'These are statutory bodies, Government companies and Institutions.',
          project_categories_id: 'Project Category',
          //background-form
          situation_analysis: `Conduct an initial/preliminary environmental scan to determine if the project will have significant negative impacts. The factors to be considered include:
          • Impacts on human health, fauna and flora, soils, land use, material assets, water quality, air quality, noise and vibration, the landscape and visual environment, historical and cultural heritage resources, and the interactions between them.
          Indicate steps that could be proposed in the project design to reduce, avoid or offset significant adverse impacts.
          A climate impact scan should also be done based on available data. This should include:  Listing the Climate Risk Events/Hazards that are likely to occur in the project area in the future (e.g. landslides, hurricane–winds, sea level rise, hurricane storm surge, flooding and drought); determining the likelihood of these various climate risk events/hazards impacting the project in the future; and determining the extent of damage that is likely to done to the project if any of the climate risk events (hazards) occur? 
          These preliminary findings as well as the recommendations should be used to inform the detailed EIA for enhanced climate resilience at the proposal stage.
          N.B: Use the CCCORAL platform or some other appropriate tool/technique to assist with the Climate Change Scan.
          `,
          situation_analysis_file: ``,
          problem_statement: `Project Status`,
          problem_statement_file: '',
          problem_cause: `"Financial (including cost savings), technical, economic, social, environmental, etc.)
          What are some of the immediate/medium term benefits/outputs to implementing the project?
          [Short term: 12-24 months, Medium term: 3-5 years]
          "`,
          problem_causes_file: 'Problem Causes Attachment',
          problem_effects:
            'Clarify whether the completion or effectiveness of the project will be dependent on any event, or other project(s), and conversely, whether any other project(s) is dependent on this one. State what is likely to happen if these dependencies are not met.',
          problem_effects_file: 'Problem Effects Attachment',
          justification: `Who needs the good/services/ process/system that will be delivered by the project? Indicate the main beneficiaries/customers/users. 
          Estimate # of direct and indirect beneficiaries); where applicable indicate the price beneficiaries/customers are willing to pay for any product/service emanating from the project.
          `,
          risk_assessment: 'Identify at least high level potential risks that may prevent the project from achieving its objective.',
          sustainability_plan: 'Sustainability Plan',
          me_strategies: 'Outline the state of readiness of the organizational systems and capacity for monitoring and evaluation of this project.Indicate if any external support would be required to enhance the current organizational systems and capacity for monitoring and evaluation of this project',
          justification_file: 'Justification Attachment',
          stakeholders:
            'Identify the key stakeholders that are likely to be affected by the interventions including: (i) Direct Beneficiaries (ii) Indirect Beneficiaries (iii) Project Affected Persons.  Give a brief description of the likely impact of the project on the stakeholders.',
          government_agencies: {
            name: 'Identify the government agency that will take part in the project implementation',
            details:
              'Describe the specific activities and issues for which the identified government agency will coordinate the implementation and it`s role',
          },
          stakeholder: {
            name: 'Stakeholder Name',
            responsibilities: 'Stakeholders Responsibilities',
          },
          evaluation_methodology: 'Evaluation Methodology',
          achieved_outcomes: 'Achieved Outcomes',
          deviation_reasons: 'Deviation Reasons',
          measures: 'Measures',
          lessons_learned: 'Lessons Learned',
          in_ndp: {
            title:
              'Please select National Development Plan if the project is included in the plan. Select Other if project is included in other strategic directives.',
            yes: 'Yes',
            other: 'Other',
          },
          ndp_type: {
            title: 'Please identify the NDP type in which the project belongs to',
            core: 'NDP Core Projects',
            priority: 'NDP Priority Area',
          },
          ndp_name: 'Project Name',
          ndp_page_no: 'Page in NDP',
          ndp_focus_area: {
            null: '',
            title: 'Identify the focus area of the project',
            wealth_creation: 'Wealth Creation',
            inclusive_growth: 'Inclusive growth',
            competitiveness: 'Competitiveness',
          },
          ndp_intervention: 'Identify the suitable intervention from the NDP to which the project is focusing on.',
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
          ndp_plan_details: 'Give a clear description of the project in relation to the NDP',
          //--officer
          officer_title: 'Officer Title',
          officer_name: 'Officer Name',
          officer_phone: 'Officer Phone (i.e. (876)9292732)',
          officer_email: 'Officer Email',
          officer_mobile_phone: 'Officer Mobile Phone (i.e. (876)9292732)',
          //introduction
          rational_study: 'Please provide a detailed description / justification for undertaking the project',
          methodology: 'Please describe the approach and methodology adopted in conducting the Pre- Feasibility Study.',
          organization_study: 'Describe how the Pre-Feasibility Study is organized.',
          organization_study_pfs: 'Organisation of the Pre-feasibility Study',
          organization_study_fs: 'Organisation of the Feasibility Study',
          other_info: 'Provide any additional information necessary for the project',
          attachments: {
            title: 'Mandatory attachments',
            add: 'Add Attachment',
          },
          benefits: 'Benefits',
          goal: 'State the Impact statement. What is the expected ultimate (long-term: > 5 years) developmental change that the project seeks to bring about? This should be succinct.',
          commentaries: 'Commentaries',
          files: 'Project Files',
          //--demand_analys
          demand_analysis:
            'Identifies the need for public investment by assessing: (i) current demand (based on statistics provided by service suppliers/ regulators/ ministries/ national and regional statistical offices for the various types of users); (ii) future demand (based on reliable demand forecasting models) in both the scenarios with- and without the project',
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
          technical_design: `A summary of the proposed project solution shall be presented with the following headings
(i)	Location: description of the location of the project including a graphical illustration (map). Availability of land is a key aspect: evidence should be provided that the land is owned (or can be accessed) by the beneficiary, who has the full title to use it, or has to be purchased (or rented) through an acquisition process. In the latter case, the conditions of acquisition should be described. The administrative process and the availability of the relevant permits to carry out the works should also be explained.
(ii)	Technical design: description of the main works components, technology adopted, design standards and specifications. Key output indicators, defined as the main physical quantities produced (e.g. kilometers of pipeline, number of overpasses, number of trees planted, etc.), should be provided.
(iii)	Production plan: description of the infrastructure capacity and the expected utilization rate. These elements describe the service provision from the supply side. Project scope and size should be justified in the context of the forecasted demand.`,
          production_plan: 'Production Plan',
          hr_requirements: 'HR Requirements',
          legal_assessment: 'Legal Assessment',
          financial_evaluation: 'Financial/Private Evaluation',
          economic_evaluation: 'Economic/Social Evaluation',
          risk_evaluations: 'Risk Evaluation',
          distributional_assessment: 'Distributional Assessment',
          exec_management_plan:
            'Describe the key headline information from the components of the feasibility study assessment the option evaluated, key results and recommendations.',
          sustainability_assessment: 'Sustainability Assessment',
          //TechnicalApproachForm
          pcn_outcome: 'Outcomes',
          pcn_interventions: 'Interventions',
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
        fields: {
          code: 'Organisation Code',
          name: 'Organisation Name',
        },
      },
      departments: {
        fields: {
          code: 'Sub Program Code',
          name: 'Sub Program Name',
          organization_id: 'Organisation Name',
          vote_id: 'Vote Name',
          sector_id: 'Sector Name',
        },
      },
      funds: {
        fields: {
          code: 'Fund Code',
          name: 'Fund Name',
        },
      },
      'fund-sources': {
        fields: {
          code: 'Source of Fund Code',
          name: 'Source of Fund Name',
          fund_id: 'Fund Name',
        },
      },
      votes: {
        fields: {
          code: 'Vote Code',
          name: 'Vote Name',
          sector_id: 'Sector Name',
        },
      },
      'vote-functions': {
        fields: {
          code: 'Program Code',
          name: 'Program Name',
          vote_id: 'Vote Name',
        },
      },
      sectors: {
        fields: {
          code: 'Sector Code',
          name: 'Sector Name',
        },
      },
      outcomes: {
        fields: {
          name: 'State the Specific, Measurable, Achievable, Realistic and Timely (SMART) high level result to be attained from this project'
        },
        actions: {
          create: 'Create Outcome',
          edit:
            'For each project outcome identified, you are required to define at least one indicator that will be used to measure performance of the project against the relevant outcome and briefly explain how information on this indicator shall be obtained.',
        },
      },
      outputs: {
        fields: {
          outcome_ids: 'Select the project objectives for the project component.',
          name: 'Describe the main project component.',
          description: 'Clearly define the component and how it will be implemented.',
          vote_id: 'Identity the implementing Agency that will undertake the component',
          output_value: 'Quantity',
          unit_id: 'Unit',
          tech_specs: 'Technical Specifications',
          alternative_specs: 'Alternative Specification',
          investments: {
            name: 'Outputs Investments',
            fields: {
              fund_id: 'Fund',
              fund_source_id: 'Fund sources',
              total: 'Total',
              cost_classification_id: 'Cost Classification',
            },
            actions: {
              edit: 'Estimated Cost',
            },
          },
        },
      },
      subcomponents: {
        name: "Sub-Component |||| Sub-Components",
        fields: {
          name: "Sub-Component Title",
          description: "Sub-Component Description",
        },
      },
      components: {
        name: "Component |||| Components",
        fields: {
          subcomponents: "Sub-Components",
          cost: "Component Cost",
          name: "Component Title",
          description: "Component Description and Implementation Arrangements",
        },
      },
      indicators: {
        fields: {
          name:
            'For each project output identified, you will be required to define at least one indicator that will be used to measure performance of the project against the relevant output and briefly explain how information on this indicator (s) shall be obtained.  This could be through surveys or secondary data sources',
          baseline: 'Identify a standard that will be used to measure the performance of the project',
          verification_means: 'Define the exact source of data that will be used to evaluate and measure performance',
          assumptions: 'Describe the conditions that must be met to obtain the expected project objectives.',
          risk_factors: 'Clearly provide information about the risks that may affect the project activities',
          target: 'Identify the expected performance of the project in each financial year.',
        },
      },
      'project-categories': {
        fields: {
          project_categories_id: 'Project Category Id',
          title: 'Project Category Title',
          last_phase_id: 'Last Phase',
        },
      },
      activities: {
        fields: {
          name: 'For the identified components highlight the major activities that you propose to implement.',
          start_date: 'Identify the activity start date',
          end_date: 'Identify the activity end date',
          description: 'Describe specific details of the activity.',
          output_id: 'Identify the component to which the activity belongs to.',
          vote_id: 'For the given activity identify the corresponding votes',
          investments: {
            fields: {
              fund_id: 'Fund',
              fund_source_id: 'Fund sources',
              total: 'Total',
              cost_classification_id: 'Cost Classification',
            },
            actions: {
              edit: 'Estimated Cost',
            },
          },
        },
      },
      project_options: {
        fields: {
          default_option_name: 'Maintaining things as they are currently with no major change',
          default_option_description: "Clearly describe the Maintaining things",
          default_option_description_impact: "Impacts of maintaining the status quo",
          has_omp: 'Will the project option have O&M period?',
          om_start_date: 'Identify the option`s O&M start date',
          om_end_date: 'Identify the option`s O&M end date',
          om_duration: 'Estimate O&M option duration',
          om_cost: 'O&M Costs',
          is_shortlisted: 'Is Preferred Option',
          is_commercial: 'Is this project a commercially driven and was the business Case Developed? ',
          me_strategy: 'Strategy',
          start_date: 'Identify the financial year in which the project option  is expected to commerce',
          end_date: 'Identify the financial year in which the project option  is expected to be completed',
          duration: 'Estimate the option duration',
          capital_expenditure: 'Capital Expenditure',
          risk_allocation: 'Risk Allocation',
          contract_management: 'Contract Management',
          swot_analysis: 'Clearly outline among  the strengths, weaknesses, threat and opportunities',
          value_for_money: 'Value for Money',
          name: 'Describe the title of the option intended to achieve the project objective.',
          title: 'Describe the title of the option intended to achieve the project objective.',
          description: 'Describe the option identified clearly detailing its components.',
          cost: 'Identify the investment cost for this option',
          score: 'The option score is autogenerated after populating the building blocks',
          funding_modality: {
            title: 'Identify the preferred funding modality suitable for the option.',
            title_pfs: 'Identify the preferred Implementation modality suitable for the option.',
            procurement: 'Traditional procurement',
            partnership: 'Public private partnership',
          },
          is_preferred: 'Identify Preferred Alternative',
          justification: 'Provide a detailed description for the selection of the option as the project intervention.',
          modality_justification:
            'Provide a detailed description for the selection of the option as the preferred project funding modality',
          modality_justification_pfs:
            'Provide a detailed description for the selection of the option as the project intervention.',
          stepper: {
            description: 'Description',
            building_blocks: 'Building Blocks',
            analytical_modules: 'Analytical Modules',
            best_option: 'Preferred Alternative Selection',
          },
          building_blocks: {
            description: {
              demand_module:
                'Describe the nature and source of demand, nature of the market, prices and qualities of the project.',
              technical_module:
                'Determine and specify in detail the technical parameters, investment and operational costs',
              environmental_module:
                'Determine and specify the environmental impacts and risks, possible compensation for the ecological damages and where possible qualify the environmental impacts.',
              hr_module:
                'Determine the human resource requirements for implementation and operation, in terms of quantities and specialties; identifies the sources of the work force and the cost of employing them. In addition, determine the management capacity and the functional structure of the operating entity.',
              legal_module:
                'Describe the legal restrictions that may obstruct or impede construction or operation, for example, limitations in localization and in the use of land, special tax considerations, and guarantees in the case of Public- Private Partnership among others.',
            },
            advantage: {
              demand_module: 'Identify the advantages of the option in relation to demand module',
              technical_module:
                'Identify the advantages of the option in relation to the technical and engineering module',
              environmental_module: 'Identify the advantages of the option in relation to the environmental module',
              hr_module: 'Identify the advantages of the option in relation to the HR requirement module',
              legal_module: 'Identify the advantages of the option in relation to the legal assessment module',
            },
            disadvantage: {
              demand_module: 'Identify the disadvantages of the option in regard to demand module.',
              technical_module:
                'Identify the disadvantages of the option in relation to the technical and engineering module',
              environmental_module: 'Identify the advantages of the option in relation to the environmental module',
              hr_module: 'Identify the disadvantages of the option in relation to the HR requirements module',
              legal_module: 'Identify the disadvantages of the option in relation to the legal assessment module',
            },
            score: 'Score',
            modules: {
              demand_module: 'Demand Analysis',
              technical_module: 'Technical & Engineering',
              environmental_module: `Describe and specify the economic effects of environmental norms and possible compensations for ecological damages. Key questions to address:
The likely environmental impacts from undertaking project?
(i)	What is the cost of reducing the negative impact?
(ii)	Evaluation of the environmental impacts and risks with and without
(iii)	Technical measures are taken to reduce these impacts?
(iv)	Are there alternative ways of supplying the good or service of project without incurring these environmental costs?
(v)	What are the costs of these alternatives?`,
              hr_module: `Point out the human resource requirements for implementation and operation, in terms of quantities and specialties; identifies the sources of the work force. Also it determines the management capacity and the functional structure of the operating entity.  Key Issues to be addressed:
(i)	What are the managerial and labour needs of the project?
(ii)	Does organisation have the ability to get the managerial skills
Needed?
(iii)	Is timing of project consistent with quantity and quality of
(iv)	Management?
(v)	What are wage rates for labour skills required?
(vi)	Manpower requirements by category are reconciled with
(vii)	availabilities and project timing.`,
              legal_module: `Studies the legal restrictions that may obstruct or impede construction or operation, for example, limitations in localization and in the use of soil, special tax considerations in the case of public–private partnerships, etc.
(i)	Is the entity that is supposed to manage the project properly
organized and its management adequately equipped to handle the
Project?
(ii)	Are the capabilities and facilities being properly utilized?
(iii)	Is there a need for changes in the policy and institutional set up
(iv)	Outside this entity? What changes may be needed in policies of the Local, regional and central governments?`,
            },
          },
          analytical_modules: {
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
              appraisal_methodology: 'Select the appraisal methodology to be used.',
              fnpv: 'State the Financial Net Present Value obtained using the selected appraisal methodology.',
              irr: 'State the Internal Rate of Return using the selected appraisal methodology',
              summary: `Describe the financial costs and benefits at market prices, studies alternative financial leverage methods.
(i)	Integration of financial and technical variables from demand module, technical module, and management module
(ii)	 Construct cash flow (resource flow) profile of project
(iii)	Identify key variables for doing economic and social analysis

Key questions:
a. What is relative certainty of financial variables?
b. What are sources and costs of financing?
c. What are minimum cash flow requirements for each of the stakeholders?
d. What can be adjusted to satisfy each of the stakeholders?`,
            },
            economic_evaluation: {
              appraisal_methodology: 'Select the appraisal methodology to be used.',
              enpv: 'State the Economic Net Present  Value obtained using the selected appraisal methodology.',
              err: 'State the Internal Rate of Return using the selected appraisal methodology',
              summary: `Economic adjustments from financial data using conversion factors; after that, costs and benefits are appraised from the point of view of the entire economy.
(i)	Examines the project using the whole country as the accounting
entity
(ii)	Evaluation of externalities including environmental
(iii)	What are differences between financial and economic values for a
Variable?
(iv)	What causes these differences?
(v)	With what degrees of certainty do we know values of these
Differences?
(vi)	What is the expected value of economic net benefits?
(vii)	What is the probability of positive economic feasibility?`,
            },
            criterias: {
              title: 'Cost Effectiveness Results',
              criteria_title: 'Describe the Cost Effectiveness Analysis method that will be used',
              criteria_value: 'State the value obtained using the CEA method selected',
              measure_unit: 'Identify the measurement units that are used in the analysis',
            },
            stakeholder_evaluations: {
              communication_channel: 'Identify the means of communication that will be used by the stakeholder',
              influence_level: 'Select the stakeholders level of project influence',
              interest_level: 'Identify the level of interst in the project by the stakeholder',
              responsibilities: 'Describe the need of the stakeholder identified.',
              responsible_entity: 'Responsible Entity',
              engagement_frequency: 'Select the number of times the stakeholder will e engaged in the project activities.',
              name: 'Identify the stakeholders that will be affected by the project as well as those who need to make inputs into the project',
              title: 'Identify the stakeholders that will be affected by the project as well as those who need to make inputs into the project',
              description: 'Give a detailed description of the stakeholder.',
              impact_sign: {
                title: 'Select the likely impact of the project on the stakeholders',
                positive: 'Positive',
                negative: 'Negative',
              },
              beneficiary: {
                title: 'Identify the relationship of the stakeholder to the project',
                direct: 'Direct',
                indirect: 'Indirect',
              },
            },
            risk_evaluations: {
              description: 'identify the uncertainty that may arise during the lifetime of the project.',
              occurrence: 'Select the likelihood of occurrence of the uncertainty',
              impact: 'Select the impact of the risk on the project',
              levels: {
                low: 'Low',
                medium: 'Medium',
                high: 'High',
                very_high: 'Very High',
              },
              mitigation_plan:
                'Identify and generate guidance on how to reduce the exposure of the risk through different contractual clauses.',
            },
            modules: {
              financial: 'Financial',
              economic: 'Economic',
              distributional: 'Distributional',
              risk: 'Risk',
            },
          },
        },
      },
      risk_factors: {
        fields: {
          risk_level: 'Risk Level',
          measures: 'Measures',
          risk_description: 'Risk Description',
        },
      },
      'file-types': {
        fields: {
          is_required: 'Is Required',
          phase_ids: 'Project Phases',
          name: 'File Type Name',
          extensions: 'File Type Extension',
        },
      },
      users: {
        name: 'User Management',
        fields: {
          username: 'Username',
          email: 'E-mail',
          fullname: 'Full Name',
          phone: 'Phone (i.e. (876)9292732)',
          vote: 'Vote',
          role: 'Role',
          password_hash: 'Enter New Password',
          sector_id: 'Sector Name',
          vote_id: 'Vote Name',
          department_id: 'Sub Program Name',
          sector_ids: 'Name of Sectors',
          donor_id: 'Donors Name',
          user_roles: 'User Roles',
          ministry: 'Level 1 includes Ministries',
          public_body: 'Level 2 includes Public bodies, Ministries Departments and Agencies.'
        },
      },
      'cost-classifications': {
        fields: {
          code: 'Code',
          name: 'Name',
          cost_category_id: 'Cost Category',
        },
      },
      'cost-categories': {
        fields: {
          code: 'Code',
          name: 'Name',
          expenditure_type: 'Expenditure Type',
        },
      },
    },
    workflow: {
      assign: 'Select assigned user',
      decision: 'Input decision reason',
      assign_user: 'Assigned user',
    },
  },
};
