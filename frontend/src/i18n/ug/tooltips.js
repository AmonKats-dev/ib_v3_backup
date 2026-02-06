export default {
  tooltips: {
    resources: {
      project: {
        myc_data: {
          funding_source: "Funding Source",
          start_date: "Start Date ",
          end_date: "End Date ",
          status: "Project Status",
          classification: "Project Classification",
          start_spending: "Spending since start of project",
          approved_budget: "Approved Budget FY 1",
          estimate_areas: "Estimate of Arrears at end of the current FY 1",
          counterpart_funding:
            "Counterpart Funding signed agreements only (value FY 1)",
          cash_required: "Cash Required for Commitments (FY 1)",
          arrears_contractual: "Arrears + All Contractual Commitments (FY 1 )",
          estimate_f2: "FY 2 ",
          estimate_f3: "FY 3 ",
          estimate_f4: "FY 4 ",
          estimate_f5: "FY 5 ",
          outstanding_commitments: "Outstanding Commitments",
          cumulative_expenditure:
            "Cummulative expenditure to end June FY0 + Approved budget + Total Estimates",
          approved_project_costs:
            "Approved Project Costs by DC as indicated in the PIP",
          mda_comments:
            "Comments from MDA (Important information or assumptions when populating the template)",
        },
      },
      "me-reports": {
        name: "M&E Report",
        fields: {
          start_date: "Start Date",
          end_date: "End Date",
          effectiveness_date:
            "Indicate the date agreed upon by the implementing agency and the external funder when the project will commence in the financing agreement.",
          disbursement: "Disbursement requested for the next quarter",
          signed_date: "Contract Signed Date",
          financing_agreement_date:
            "Indicate the specific date the financing agreement was signed. ",
          summary:
            "summarize the vital information in the monitoring report which includes components like implemented outputs, financial performance challenges, recommendations and lessons learned.",
          rational_study:
            "Describe the scope and provide a brief explanation of the report.",
          methodology:
            "Describe the approach & methodology used during monitoring of the project.",
          risk_description:
            "Describe the likely risks that may impact project implementation",
          risk_response:
            "Identify the strategies to address the likely risks affecting the project",
          challenges_measures:
            "Identify the challenges that are affecting implementation of the project output and measures to overcome these challenges.",
          quarter: "Indicate the quarter for the reporting period",
          year: "Indicate the reporting financial year",
          data_collection_type:
            "Indicate the method used in gathering information on the targeted variables i.e surveys, interviews, observation and experiment",
          me_outputs: "Outputs",
          output_progress:
            "Indicate the percentage of completion of the project output.",
          indicators: "Indicators",
          target:
            "What is the achieved output value at a given reporting period?",
          me_activities: "Activities",
          status: "Status",
          expected_completion_date: "Expected Completion Date",
          challenges:
            "Describe the problems encountered during project implementation and how this affected project implementation.",
          lessons_learned:
            "Please detail the lessons learned both positive and negative during project implementation.",
          recommendations:
            "Describe the measures that were or can be implemented to address the problems encountered during project implementation.",
          measures: "Measures",
          issue_recommendations:
            "Describe the measures that can be implemented to overcome the challenge identified.",
          issue_challenges:
            "Identify the problem affecting progress of the project implementation.",
          allocation_challenges: "Allocation Challenges",
          budget_appropriation: "Budget Appropriation",
          allocation_measures: "Allocation Measures",
          financial_execution: "Financial Execution",
          execution_challenges: "Execution Challenges",
          execution_measures: "Execution Measures",
          next_budget_appropriation: "Next Budget Appropriation",
          me_releases: "Releases",
          type: "Type",
          government: "Government",
          donor: "Donor",
          budget_allocation: "Budget Allocation",
          me_type: "Select the type of M&E methodology used",
          approved_budget: "Indicate the approved funds for the project.",
          revised_budget: "Indicate the revised funds for the project.",
          budget_released:
            "Indicate the approved funds that have been released for the project implementation.",
          release_spent:
            "Indicate the funds that have been spent on the project implementation so far.",
          source_of_funds: "Identify the source of funds",
          remarks: "Remarks",
          overall_project_rating: "Overall Rating",
          gender_equity: "Ender Equity",
          social_safe_guards: "Social Safeguards",
        },
      },
      roles: {
        fields: {
          name: "Role Name",
          is_deleted: "Is Deleted",
          permissions: "permissions",
          organization_level: "organization_level",
          has_allowed_projects: "has_allowed_projects",
        },
      },
      om_costs: {
        om_fund_id:
          "Select the fund name from which the operation and maintenance cost will be obtained from.",
        om_fund_source_id:
          "Select the source from where the operation and maintenance cost will be got from",
        om_cost_category_id: "Select the cost category of the expense",
        om_cost_classification_id:
          "Select the cost classification of the expense",
        om_years:
          "Identify the amounts that will be spent for each financial year.",
      },
      reports: {
        projects_by_location_help:
          "Turn on/off selectors to filter projects showed on geo map",
        projects_by_location_filters:
          "Select Sector or Vote to filter projects showed on geo map",
      },
      projects: {
        fields: {
          program: "Select the program under which this project is classified.",
          project_no:
            "A unique project identification number that can be used to track the project throughout its lifecycle.",
          created_by: "User that created project",
          created_at: "Submission Date",
          phase_id: "Phase of the project.",
          status: "Status of the project.",
          "workflow.status": "Workflow Step",
        },
      },
      "project-details": {
        fields: {
          name: "Enter a clear project title, avoiding duplication of names within the Public Investment Plan.",
          expected_fund_source: "Expected fund source",
          national_scope:
            "Interventions that directly target growth in key highly poverty hit regions as identified in the NDP III. For example Bukedi, Busoga, Bugisu, Karamoja, Teso, West Nile, Acholi and Bunyoro.",
          procurement_plan_description:
            "Describe how goods and services will be acquired from outside your entity such as source. Clearly specify the type of contracts that will be, the processes for obtaining and evaluating the bids and describe how the various providers will be managed. Describe how procurement activities will be managed. ",
          work_plan_description:
            "Describe how the project costs will be managed over runs, budget cuts etc.",
          behavior_knowledge_products:
            "What knowledge products or transfer activities will be developed or conducted as part of this project?",
          behavior_project_results:
            "How will your project results reach your target population(s) and how do you plan to follow-up?",
          behavior_measures:
            "What measures have been put in place to ensure that this problem does not occur again",

          vote: "This is a self accounting entity",
          central:
            "Identify the place where the project is going to be executed.",
          classification: `Social Investments -	These are projects with investments aimed at improving the social welfare of citizens or those that will result into creation of intangible assets that are declared as Government assets in the Charter of accounts(Transfer, funds, seedling).|
          Infrastructure Project -	This is a capital investment aimed at the acquisition or rehabilitation of fixed capital assets based which belong to Government of Uganda.|
          Studies	- These only consider complex studies leading to viability of the project of which will assist in Physical planning.|
          Institutional Development Project -	These projects assist MDA acquire fixed assets needed to support staff in executing the delivery of services.  The fixed assets shall exclude construction of office space, land acquisition and acquisition of heavy duty equipment.`,
          responsible_officers: {
            title: "This is the officer responsible for the project.",
            coordinator: "This is the Officer implementing the project.",
            name: "Officer Name",
            phone: "Officer Phone",
            email: "Officer Email",
            mobile_phone: "Officer Mobile Phone",
            organization_name: "Officer Organization Name",
            address: "Officer Address",
          },
          current_investment_ratio: "Capital to Recurrent Ratio",
          title:
            "Let it be as clear as possible, avoiding duplication of names within the Public Investment Plan",
          summary:
            "Provide a detailed technical description detailing the project planning elements required to achieve the project outcome.",
          start_date:
            "Indicate the financial year in when the project is expected to commence.",
          end_date: "The expected date of the project construction completion",
          duration: "Estimate the project construction timeline",
          location:
            "Precisely identify all the districts where the project will be located.",
          geo_location: "Geo Location",
          province: "Province",
          estimated_lifetime:
            "Operational life of the project after construction is completed. A typical operational lifetime of infrastructure project range from 10 to 25 years.",
          is_dlp: "Select if project has a defect liability period.",
          liability_period:
            "Defect Liability Period of the project. Enter number of years.",
          is_omp: "Select if project has operation & maintenance Period",
          evaluation_period: "Number of years after project completion",
          maintenance_period:
            "Operational life of the project after construction is completed. A typical operational lifetime of infrastructure project range from 10 to 25 years.",
          introduction: "Introduction",
          implementing_agencies:
            "Agencies responsible for delivery of the project outputs.",
          project_categories_id: "Project Category",
          //background-form
          situation_analysis:
            "Provide a background to the project idea or the problem your project will focus on by: (i) describing current situation including past and on-going interventions; ii) recent developments in the area of interest, achievements and challenges if any, iii) Explain projected trends using published forecasts. Quote official statistics to support your narrative.",
          situation_analysis_file: `Provide a background to the project idea or the problem your project will focus on by;
	(i) describing the current situation including past and on-going interventions, recent developments in the area of interest, achievements and challenges if any.
        Quote official statistics to support your narrative.
	(ii) Explaining projected trends using published forecasts
        `,
          problem_statement: `Provide an explicit definition of the problem to be addressed in terms of challenges, constraints or gaps that the market or private sector cannot resolve and:
	i.	 Mention the likely causes of the problem both direct and indirect and
	ii.	 Give a brief insight of the likely consequences if no government intervention is made.`,
          problem_statement_file:
            "Provide an explicit definition of the problem to be addressed in terms of challenges, constraints or gaps that the market or private sector cannot resolve.",
          problem_cause:
            "Please provide the likely causes of the problem both direct and indirect.",
          problem_causes_file: "Problem Causes Attachment",
          problem_effects:
            "Please provide a brief insight of the likely consequences if no government intervention is made.",
          problem_effects_file: "Problem Effects Attachment",
          justification:
            "Justify the need for the proposed project by: (i) linking the project to the National Development Plan (NDP) strategic interventions by identifying the objective (s) that the proposed project is expected to contribute to; (ii) Linking the proposed project to Sector Investment Plan (SIP) objectives by describing the sector outcomes that the project is expected to impact.",
          sustainability_plan: "Sustainability Plan",
          me_strategies: "Monitoring and Evaluation Strategies",
          justification_file: "Justification Attachment",
          stakeholders:
            "Identify the key stakeholders that are likely to be affected by the interventions including: (i) Direct Beneficiaries (ii) Indirect Beneficiaries (iii) Project Affected Persons.  Give a brief description of the likely impact of the project on the stakeholders.",
          government_agencies: {
            name: "Identify the government agency that will take part in the project implementation",
            details:
              "Describe the specific activities and issues for which the identified government agency will coordinate the implementation and it`s role",
            description:
              "Describe the specific activities and issues for which the identified government agency will coordinate the implementation and it`s role",
          },
          stakeholder: {
            name: "Stakeholder Name",
            affected_population:
              "Indicate the stakeholders / project affected persons for this project categories disaggregated in gender, vulnerability, economic activities etc.",
            responsibilities:
              "Identify the persons group or organization that are involved in delivery or affected by a particular project. (i) Direct Beneficiaries (ii) Indirect Beneficiaries (iii) Project Affected Persons. ",
          },
          evaluation_methodology: "Evaluation Methodology",
          achieved_outcomes: "Achieved Outcomes",
          deviation_reasons: "Deviation Reasons",
          measures: "Measures",
          lessons_learned: "Lessons Learned",
          in_ndp: {
            title:
              "Please select National Development Plan if the project is included in the plan. Select Other if project is included in other strategic directives.",
            yes: "Yes",
            other: "Other",
          },
          ndp_type: {
            title:
              "Please identify the NDP type in which the project belongs to",
            core: "NDP Core Projects",
            priority: "NDP Priority Area",
          },
          ndp_number: "Project NDP Number",
          ndp_name: "Project Name",
          ndp_page_no: "Page in NDP",
          ndp_focus_area: {
            null: "",
            title: "Identify the focus area of the project",
            wealth_creation: "Wealth Creation",
            inclusive_growth: "Inclusive growth",
            competitiveness: "Competitiveness",
          },
          ndp_intervention:
            "Identify the suitable intervention from the NDP to which the project is focusing on.",
          ndp_strategic_directives: "Other Strategic Directives",
          other_plans: {
            development_partners: "Development partners",
            cabinet_directives: "Cabinet directives",
            parliament_approval: "Parliament approval",
            stare_owned_enterprise: "Stare owned enterprise",
            regional_integration_policy: "Regional integration policy",
            political_manifestos: "Political manifestos",
            interest_groups_or_beneficiaries:
              "Interest groups or beneficiaries",
            private_sponsors: "Private sponsors",
            sustainable_development_goals: "Sustainable development goals",
          },
          ndp_plan_details:
            "Give a clear description of the project in relation to the NDP",
          //--officer
          officer_title: "Officer Title",
          officer_name: "Officer Name",
          officer_phone: "Officer Phone",
          officer_email: "Officer Email",
          officer_mobile_phone: "Officer Mobile Phone",
          //introduction
          rational_study:
            "Please provide a detailed description / justification for undertaking the project",
          methodology:
            "Please describe the approach and methodology adopted in conducting the Pre- Feasibility Study.",
          organization_study:
            "Describe how the Pre-Feasibility Study is organized.",
          organization_study_pfs: "Organisation of the Pre-feasibility Study",
          organization_study_fs: "Organisation of the Feasibility Study",
          other_info:
            "Provide any additional information necessary for the project",
          attachments: {
            title: "Mandatory attachments",
            add: "Add Attachment",
          },
          benefits: "Benefits",
          goal: "Describe the project goal.  This should be in relation to the development objective that the project is designed to contribute to.  Identify an indicator that will be used to measure success of the project against the goal and briefly explain how information on this indicator shall be obtained.",
          commentaries: "Commentaries",
          files: "Project Files",
          //--demand_analys
          demand_analysis:
            "Identifies the need for public investment by assessing: (i) current demand (based on statistics provided by service suppliers/ regulators/ ministries/ national and regional statistical offices for the various types of users); (ii) future demand (based on reliable demand forecasting models) in both the scenarios with- and without the project",
          demand_analysis_files: "Demand Analysis Files",
          //
          pre_feasibility_cost: "Pre-Feasibility Cost",
          pre_feasibility_consultants: "Pre-Feasibility Consultants",
          strategic_analysis: "Strategic Analysis",
          strategic_alignment: "Strategic Alignment",
          //FinancialAnalysisForm
          financing_modality: "Financing Modality",
          feasbility_cost: "Feasibility Cost",
          feasibility_consultants: "Feasibility Consultants",
          feasibility_funds_request: "Feasibility Funds Request",
          env_impact_assessment: "Environmental Impact Assessment",
          //modules
          technical_design: `A summary of the proposed project solution shall be presented with the following headings
(i)	Location: description of the location of the project including a graphical illustration (map). Availability of land is a key aspect: evidence should be provided that the land is owned (or can be accessed) by the beneficiary, who has the full title to use it, or has to be purchased (or rented) through an acquisition process. In the latter case, the conditions of acquisition should be described. The administrative process and the availability of the relevant permits to carry out the works should also be explained.
(ii)	Technical design: description of the main works components, technology adopted, design standards and specifications. Key output indicators, defined as the main physical quantities produced (e.g. kilometers of pipeline, number of overpasses, number of trees planted, etc.), should be provided.
(iii)	Production plan: description of the infrastructure capacity and the expected utilization rate. These elements describe the service provision from the supply side. Project scope and size should be justified in the context of the forecasted demand.`,
          production_plan: "Production Plan",
          hr_requirements: "HR Requirements",
          legal_assessment: "Legal Assessment",
          financial_evaluation: "Financial/Private Evaluation",
          economic_evaluation: "Economic/Social Evaluation",
          risk_evaluations: "Risk Evaluation",
          distributional_assessment: "Distributional Assessment",
          exec_management_plan:
            "Describe the key headline information from the components of the feasibility study assessment the option evaluated, key results and recommendations.",
          sustainability_assessment: "Sustainability Assessment",
          //TechnicalApproachForm
          pcn_outcome: "Outcomes",
          pcn_interventions: "Interventions",
          investments: "Investment Costs",
          //--background
          in_ndpi: "Already Existing in NDPI",
          in_ndpii: "Already Existing in NDPII",
          in_mfped: "Already Existing in MFPED PIP",
          strategic_other_plan: "Strategic Other Plan",
          strategic_considerations: "Other Strategic Considerations",
          strategic_fit: "Strategic Fit",
          strategic_alignment: "Strategic Alignment",
          baseline: "Indicator Baseline Year",
          outcome_targets: "Outcome Indicator Target Years",
          output_base: "Output Indicator Baseline",
          output_targets: "Output Indicator Target Years",
          coordinator_id: "Project Coordinator ID",
          me_creator_id: "M & E Creator ID",
        },
      },
      organizations: {
        fields: {
          code: "Organisation Code",
          name: "Organisation Name",
        },
      },
      departments: {
        fields: {
          code: "Sub Program Code",
          name: "Sub Program Name",
          organization_id: "Organisation Name",
          vote_id: "Vote Name",
          sector_id: "Sector Name",
        },
      },
      funds: {
        fields: {
          code: "Fund Code",
          name: "Fund Name",
        },
      },
      "fund-sources": {
        fields: {
          code: "Source of Fund Code",
          name: "Source of Fund Name",
          fund_id: "Fund Name",
        },
      },
      votes: {
        fields: {
          code: "Vote Code",
          name: "Vote Name",
          sector_id: "Sector Name",
        },
      },
      "vote-functions": {
        fields: {
          code: "Program Code",
          name: "Program Name",
          vote_id: "Vote Name",
        },
      },
      sectors: {
        fields: {
          code: "Sector Code",
          name: "Sector Name",
        },
      },
      outcomes: {
        fields: {
          name: "Define the project outcomes to include the effects that will follow from the utilization of products or services delivered by the project. These could be the eventual benefits to society that the project interventions are intended to achieve and are reflected in terms of  what people will be able to do better, faster, or more efficiently, or what they could never do before.",
        },
        actions: {
          create: "Create Outcome",
          edit: "For each project outcome identified, you are required to define at least one indicator that will be used to measure performance of the project against the relevant outcome and briefly explain how information on this indicator shall be obtained.",
        },
      },
      outputs: {
        fields: {
          outcome_ids: "Outcomes",
          name: `Describe the direct/tangible results that the project is expected to deliver.  These outputs shall be the basis for the components around which the project shall be built. Some examples of project deliverables could be: trainings equipment purchased, ICT backbone developed, infrastructure built / renovated and etc. Outputs are usually the immediate and concrete consequences of the implemented activities and resources used..
    With the exception of the project management, monitoring and evaluation components, the project outputs should relate to physical assets and must contribute at-least 70% of the total project.`,
          description:
            "Clearly describe the output. Describe the tangible products and services delivered or competences and capacities established directly as a result of the project",
          vote_id:
            "Identify the implementing agency that will undertake the identified output.",
          output_value: "Quantity",
          unit_id: "Unit",
          tech_specs: "Technical Specifications",
          alternative_specs: "Alternative Specification",
          investments: {
            name: "Outputs Investments",
            fields: {
              fund_id: "Fund",
              fund_source_id: "Fund sources",
              total: "Total",
              cost_classification_id: "Cost Classification",
            },
            actions: {
              edit: "Estimated Cost",
            },
          },
        },
      },
      indicators: {
        fields: {
          name: "For each project output identified, you will be required to define at least one indicator that will be used to measure performance of the project against the relevant output and briefly explain how information on this indicator (s) shall be obtained.  This could be through surveys or secondary data sources",
          baseline:
            "Identify a standard that will be used to measure the performance of the project",
          verification_means:
            "Define the exact source of data that will be used to evaluate and measure performance",
          assumptions:
            "Describe the conditions that must be met to obtain the expected project objectives.",
          risk_factors:
            "Clearly provide information about the risks that may affect the project activities",
          target:
            "Identify the expected performance of the project in each financial year.",
        },
      },
      "project-categories": {
        fields: {
          project_categories_id: "Project Category Id",
          title: "Project Category Title",
          last_phase_id: "Last Phase",
        },
      },
      activities: {
        fields: {
          name: "For each output briefly highlight the major activities that you propose to implement in order to achieve the output",
          start_date:
            "For the given activity identify the financial year when it’s expected to commerce",
          end_date: "Provide the expected end date of the define activity",
          description: "Describe specific details of the activities.",
          output_id: "For the given activity identify the corresponding output",
          vote_id: "For the given activity identify the corresponding votes",
          investments: {
            fields: {
              fund_id: "Fund",
              fund_source_id: "Fund sources",
              total: "Total",
              cost_classification_id: "Cost Classification",
            },
            actions: {
              edit: "Estimated Cost",
            },
          },
        },
      },
      project_options: {
        fields: {
          title:
            "Describe the title of the option intended to achieve the project objective.",
          description:
            "Describe the option identified clearly detailing its components.",
          cost: "Identify the investment cost for this option",
          score:
            "The option score is autogenerated after populating the building blocks",
          funding_modality: {
            title:
              "Identify the preferred funding modality suitable for the option.",
            title_pfs:
              "Identify the preferred Implementation modality suitable for the option.",
            procurement: "Traditional procurement",
            partnership: "Public private partnership",
          },
          is_preferred: "Identify Preferred Alternative",
          justification:
            "Provide a detailed description for the selection of the option for the project intervention.",
          modality_justification:
            "Provide a detailed description for the selection of the option for the project preferred Funding Modality.",
          modality_justification_pfs:
            "Provide a detailed description for the selection of the option for the project intervention.",
          stepper: {
            description: "Description",
            building_blocks: "Building Blocks",
            analytical_modules: "Analytical Modules",
            best_option: "Preferred Alternative Selection",
          },
          building_blocks: {
            description: {
              demand_module:
                "Describe the nature and source of demand, nature of the market, prices and qualities of the project.",
              technical_module:
                "Determine and specify in detail the technical parameters, investment and operational costs",
              environmental_module:
                "Determine and specify the environmental impacts and risks, possible compensation for the ecological damages and where possible qualify the environmental impacts.",
              hr_module:
                "Determine the human resource requirements for implementation and operation, in terms of quantities and specialties; identifies the sources of the work force and the cost of employing them. In addition, determine the management capacity and the functional structure of the operating entity.",
              legal_module:
                "Describe the legal restrictions that may obstruct or impede construction or operation, for example, limitations in localization and in the use of land, special tax considerations, and guarantees in the case of Public- Private Partnership among others.",
            },
            advantage: {
              demand_module:
                "Identify the advantages of the option in relation to demand module",
              technical_module:
                "Identify the advantages of the option in relation to the technical and engineering module",
              environmental_module:
                "Identify the advantages of the option in relation to the environmental module",
              hr_module:
                "Identify the advantages of the option in relation to the HR requirement module",
              legal_module:
                "Identify the advantages of the option in relation to the legal assessment module",
            },
            disadvantage: {
              demand_module:
                "Identify the disadvantages of the option in regard to demand module.",
              technical_module:
                "Identify the disadvantages of the option in relation to the technical and engineering module",
              environmental_module:
                "Identify the advantages of the option in relation to the environmental module",
              hr_module:
                "Identify the disadvantages of the option in relation to the HR requirements module",
              legal_module:
                "Identify the disadvantages of the option in relation to the legal assessment module",
            },
            score: "Score",
            modules: {
              demand_module: "Demand Analysis",
              technical_module: "Technical & Engineering",
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
            description: "Description",
            advantage: "Advantages",
            disadvantage: "Disadvantages",
            score: "Score",
            appraisal_methodology: {
              title: "Appraisal Methodology",
              cea: "CEA",
              cba: "CBA",
            },
            financial_evaluation: {
              appraisal_methodology:
                "Select the appraisal methodology to be used either CBA or CEA",
              fnpv: "State the Financial Net Present Value obtained using the selected appraisal methodology",
              irr: "State the Internal Rate of Return obtained using the selected appraisal methodology",
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
              appraisal_methodology:
                "Select the appraisal methodology to be used either CBA or CEA",
              enpv: "State the Economic Net Present Value obtained using the selected appraisal methodology",
              err: "State the Economic Rate of Return obtained using the selected appraisal methodology",
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
              title: "Cost Effectiveness Results",
              name: "Cost Effectiveness Results",
              criteria_title:
                "Describe the Cost Effectiveness Analysis method that will be used",
              criteria_value:
                "State the value obtained using the CEA method selected",
              measure_unit:
                "Identify the measurement units that are used in the analysis",
            },
            stakeholder_evaluations: {
              name: "Identify the stakeholder that will be affected by the project",
              title:
                "Identify the stakeholder that will be affected by the project",
              description: "Give a detailed description of the stakeholder.",
              impact_sign: {
                name: "Select the likely impact of the project on the stakeholders",
                title:
                  "Select the likely impact of the project on the stakeholders",
                positive: "Positive",
                negative: "Negative",
              },
              beneficiary: {
                name: "Identify the relationship of the stakeholder to the project",
                title:
                  "Identify the relationship of the stakeholder to the project",
                direct: "Direct",
                indirect: "Indirect",
              },
            },
            risk_evaluations: {
              description:
                "identify the uncertainty that may arise during the lifetime of the project.",
              occurrence:
                "Select the likelihood of occurrence of the uncertainty",
              impact: "Select the impact of the risk on the project",
              levels: {
                low: "Low",
                medium: "Medium",
                high: "High",
                very_high: "Very High",
              },
              mitigation_plan:
                "Identify and generate guidance on how to reduce the exposure of the risk through different contractual clauses.",
            },
            modules: {
              financial: "Financial",
              economic: "Economic",
              distributional: "Distributional",
              risk: "Risk",
            },
          },
        },
      },
      risk_factors: {
        fields: {
          risk_level: "Risk Level",
          measures: "Measures",
          risk_description: "Risk Description",
        },
      },
      "file-types": {
        fields: {
          is_required: "Is Required",
          phase_ids: "Project Phases",
          name: "File Type Name",
          extensions: "File Type Extension",
        },
      },
      users: {
        name: "User Management",
        fields: {
          username: "Username",
          email: "E-mail",
          fullname: "Full Name",
          phone: "Phone",
          vote: "Vote",
          role: "Role",
          password_hash: "Enter New Password",
          sector_id: "Sector Name",
          vote_id: "Vote Name",
          department_id: "Sub Program Name",
          sector_ids: "Name of Sectors",
          donor_id: "Donors Name",
          user_roles: "User Roles",
        },
      },
      "cost-classifications": {
        fields: {
          code: "Code",
          name: "Name",
          cost_category_id: "Cost Category",
        },
      },
      "cost-categories": {
        fields: {
          code: "Code",
          name: "Name",
          expenditure_type: "Expenditure Type",
        },
      },
    },
    workflow: {
      assign: "Select assigned user",
      decision: "Input decision reason",
      assign_user: "Assigned user",
    },
    completionReport: {
      actual_start_date: "Identify the date in which the project commenced",
      actual_end_date: "Identify the date in which the project ended",
      actual_specifications: "Describe the actual output specifications",
      initial_completion_date: "Identify the initial intended completion date",
      actual_completion_date: "Identify the actual completion date.",
      related_challenges:
        "Describe the challenges encountered by the identified output.",
      short_term_outcomes:
        "What short term outcomes have been achieved by the project.",
      impacts: "What long-term impact is expected from the project.",
      challenges_and_recommendations:
        "Describe the problems encountered during project implementation, risks actualized and how they affected project implementation. What measures were implemented to address the problems.",
      lessons_learnt:
        "Outline the lessons learned during the implementation of this intervention.",
      future_considerations:
        " List any continuing development and operational objectives. What actions still need to be completed, and who is responsible for completing them? List any additional outstanding project activities?",
      financial_sustainability_plan:
        "Outlines the financial sustainability strategies for the intervention. ",
      environmental_sustainability_plan:
        "Identify the strategies to conserve natural resources and protect global ecosystems to support health and wellbeing for this project. ",
      project_achievements:
        "Describe the project achievements against the workplan",
    },
    help: "Help",
    user_actions: "User actions",
    notifications: "Notifications",
  },
};
