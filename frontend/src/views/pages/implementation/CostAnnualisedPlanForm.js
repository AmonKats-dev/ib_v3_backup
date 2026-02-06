import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip,
  OutlinedInput,
  Autocomplete,
  Tooltip,
  Collapse,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { API_URL } from '../../../constants/config';
import { TOKEN } from '../../../constants/auth';
import { getCurrentFiscalYear } from '../../../helpers';

const CostAnnualisedPlanForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingActivityOutputs, setLoadingActivityOutputs] = useState(false);
  const [projectData, setProjectData] = useState({
    code: id || 'N/A',
    title: 'Loading...',
  });

  const [activities, setActivities] = useState([
    {
      activityName: '',
      startDate: null,
      endDate: null,
      activityOutputs: [],
      activityDescription: '',
      // Cost details
      costPlanActivity: '',
      fund: '',
      fundSource: '',
      costCategory: '',
      costClassification: '',
      procurementMethod: '',
      procurementStartDate: null,
      contractSignDate: null,
      procurementDetails: '',
      amount: ''
    }
  ]);
  
  const [expandedCostSections, setExpandedCostSections] = useState({});
  const [showCostSections, setShowCostSections] = useState(false);
  
  // Dropdown options
  const fundOptions = [
    'Bi-lateral Donors',
    'Domestic commercial Banks',
    'Domestic GoU',
    'Foreign Commercial Banks',
    'Multi-lateral Donors',
    'Other domestic Fund sources',
    'Other Foreign Donors'
  ];
  
  // Fund source options by fund type
  const bilateralDonorsOptions = [
    'Abu Dhabi',
    'Algeria',
    'Australia',
    'Austria',
    'Belgium',
    'Bilateral Development Partners',
    'Burundi',
    'Canada',
    'China (PR)',
    'Cuba',
    'Czech Rep.',
    'Denmark',
    'Egypt',
    'Finland',
    'France',
    'Germany Fed. Rep.',
    'Greece',
    'Iceland',
    'India',
    'Iran Islamic Rep.',
    'Iraq',
    'Ireland Rep of (Eire)',
    'Israel',
    'Italy',
    'Japan',
    'Kenya',
    'Korea N. (PDR)',
    'Korea S. (Rep)',
    'Kuwait',
    'Libya',
    'Luxembourg',
    'Malaysia',
    'Mauritius',
    'Morocco',
    'Netherlands',
    'New Zealand',
    'Nigeria',
    'Norway',
    'Pakistan',
    'Portugal',
    'Qatar',
    'Russia',
    'Rwanda',
    'Saudi Arabia',
    'Singapore',
    'Spain',
    'Sweden',
    'Switzerland',
    'Tanzania',
    'Tunisia',
    'Turkey',
    'United Arab Emirates',
    'United Kingdom',
    'United States of America',
    'Yugoslavia'
  ];
  
  // Domestic commercial banks options
  const domesticCommercialBanksOptions = [
    'Allied Bank International',
    'Bank of Baroda',
    'Bank of Uganda',
    'Barclays Bank Uganda Limited',
    'Cairo International Bank',
    'Centenary Rural Development Bank',
    'Citibank (Uganda) Limited',
    'Commercial Bank Sources',
    'Crane Bank (Uganda) Limited',
    'DFCU Bank Limited',
    'Diamond Trust Bank (Uganda)',
    'National Bank of Commerce Limited',
    'Nile Bank Limited',
    'Orient Bank Limited',
    'Stanbic Bank (Uganda) Limited',
    'Standard Chartered Bank (Uganda) Limited',
    'Uganda Commercial Bank'
  ];
  
  // Domestic GoU options
  const domesticGoUOptions = [
    'Central GOU Sources',
    'Domestic Government of Uganda',
    'Local Government Sources',
    'NTR Sources',
    'Other Government Units'
  ];
  
  // Foreign Commercial Banks options
  const foreignCommercialBanksOptions = [
    'Bank Paribus',
    'Exim Bank (CHINA)',
    'Exim Bank (U.S.A.)',
    'Foreign Commercial Banks'
  ];
  
  // Multi-lateral Donors options
  const multilateralDonorsOptions = [
    'Africa Development Bank (ADB)',
    'Africa Development Fund (ADF)',
    'African Capacity Building Foundation',
    'African Union',
    'Arab Bank for Economic Development in Africa (BADEA)',
    'Bill and Merinda Gates Foundation',
    'Cities Alliance',
    'Common Fund for Commodities',
    'Common Market of Eastern and Southern Africa (COMESA)',
    'Commonwealth Development Corporation (CDC)',
    'Commonwealth Fund for Technical Cooperation',
    'Danish International Development Agency (DANIDA)',
    'East African Community (EAC)',
    'East African Compensation Fund',
    'East African Development Bank (EADB)',
    'European Development Fund (EDF)',
    'European Investment Bank',
    'European Union (EU)',
    'Food and Agricultural Oragnisation',
    'Geselleschaft fur Internationale Zusammenarbeit (GIZ)',
    'Global Alliance for Vaccines and Immunization (GAVI)',
    'Global environment Facility',
    'Global Fund for HIV, TB & Malaria',
    'International Atomic Energy Agency',
    'International Bank for Reconstruction and Development (IBRD)',
    'International Center for Tropical Agriculture',
    'International Development Association (IDA)',
    'International Finance Corporation (IFC)',
    'International Fund for Agriculture and Development (IFAD)',
    'International Labour Organisation (ILO)',
    'International Monetary Fund (IMF)',
    'International Trade Center',
    'Islamic Development Bank',
    'Japanese Bank For International Cooperation (JBIC)',
    'Japanese International Cooperation Agency (JICA)',
    'Joint (Multi/Basket) Financing',
    'Joint United Nations Programme on HIV/AIDS (UNAIDS)',
    'Korean International Cooperation Agency (KOICA)',
    'Multi-lateral development partners',
    'Nordic Development Fund',
    'Organisation of Petroleum Exporting Countries (OPEC)',
    'PTA Bank',
    'Shelter Afrique',
    'The World Bank',
    'TradeMark East Africa',
    'UNICEF',
    'United Nations',
    'United Nations Capital Development Fund',
    'United Nations Conference on Trade & Development',
    'United Nations Development Fund for Women',
    'United Nations Dev\'t Programme',
    'United Nations Economic Commission for Africa',
    'United Nations Educational, Scientific & Cultural Organisation (UNESCO)',
    'United Nations Environment Programme',
    'United Nations Expanded Programme on Immunisation (UNEPI)',
    'United Nations High Commissioner for Refugees (UNHCR)',
    'United Nations Industrial Dev\'t Organisation',
    'United Nations International Drug Control Programme',
    'United Nations Office for Partnerships [UNOP]',
    'United Nations Office for Project Services (UNOPS)',
    'United Nations Population Fund',
    'United Nations Sahel Organisation',
    'World Food Programme',
    'World Health Organisation (WHO)',
    'World Trade Organisation'
  ];
  
  // Other domestic Fund sources options
  const otherDomesticFundSourcesOptions = [
    'Action Aid (Uganda)',
    'Baylor International (Uganda)',
    'Centenary Rural Development Trust (CERUDET)',
    'Kinderhilfswerk (Uganda)',
    'Other Domestic Funding Sources',
    'The Aids Support Organisation (TASO)',
    'Uganda Development Bank (UDB)',
    'Uganda Society for Disabled Children'
  ];
  
  // Other Foreign Donors options
  const otherForeignDonorsOptions = [
    'Belgium Technical Cooperation (BTC)',
    'Catholic Relief Services',
    'Christian Engineers in Development',
    'Christian Reformed Relief Committee',
    'Cooperative for Assistance and Relief Everywhere',
    'Euro Accord',
    'Gatsby Charitable Foundation (U.K.)',
    'Handicap International',
    'InterGovernmental Authority for Development (IGAD)',
    'International Committee of the Red Cross',
    'International Development Research Centre',
    'Islamic African Relief Agency',
    'Lutheran World Services',
    'Mac Arthur Foundation',
    'Mildmay International',
    'National Science Foundation - U.S.A.',
    'Netherlands Development Organisation',
    'Other Foreign Sources of Funds',
    'Royal Commonwealth Society for the Blind',
    'Save the Children Fund',
    'UK Department for International Development (DFID)',
    'World Vision'
  ];
  
  const defaultFundSourceOptions = ['Government of Uganda', 'External Financing', 'AIA', 'GoU Arrears'];
  
  // Function to get fund source options based on selected fund
  const getFundSourceOptions = (fund) => {
    if (fund === 'Bi-lateral Donors') {
      return bilateralDonorsOptions;
    }
    if (fund === 'Domestic commercial Banks') {
      return domesticCommercialBanksOptions;
    }
    if (fund === 'Domestic GoU') {
      return domesticGoUOptions;
    }
    if (fund === 'Foreign Commercial Banks') {
      return foreignCommercialBanksOptions;
    }
    if (fund === 'Multi-lateral Donors') {
      return multilateralDonorsOptions;
    }
    if (fund === 'Other domestic Fund sources') {
      return otherDomesticFundSourcesOptions;
    }
    if (fund === 'Other Foreign Donors') {
      return otherForeignDonorsOptions;
    }
    // Add more conditions for other fund types as needed
    return defaultFundSourceOptions;
  };
  // Cost category options
  const costCategoryOptions = [
    'Appraisal and Feasibility Studies for Capital Works',
    'Assets',
    'Compensation of Employees',
    'Consumption of Fixed Assets',
    'Domestic Liabilities',
    'Employee Costs',
    'Financial Assets',
    'Foreign',
    'General use of goods and services',
    'Grants',
    'Impairment of Assets',
    'Insurances and Licenses',
    'Interest Payable',
    'Other Expenses',
    'Social Benefits',
    'Subsidies',
    'Tax Refunds',
    'Use of Goods & Services'
  ];
  
  // Cost classification options for ASSETS cost category
  const assetsCostClassificationOptions = [
    'Aircrafts',
    'Classified Assets',
    'Computer databases - Stock',
    'Cultivated Assets',
    'Finished goods',
    'Furniture & Fixtures',
    'Goods for resale',
    'Gross Tax',
    'ICT Equipment',
    'Intangible Fixed Assets',
    'Laboratory and Research Equipment',
    'Land',
    'Machinery and Equipment',
    'Materials and supplies',
    'Medical Equipment',
    'Non-Residential Buildings',
    'Non-Residential Buildings - Stock',
    'Office Equipment',
    'Other Structures',
    'Petroleum Products',
    'Residential Buildings',
    'Roads and Bridges.',
    'Taxes on Buildings & Structures',
    'Taxes on Machinery, Furniture & Vehicles',
    'Transport Equipment',
    'Work in progress'
  ];
  
  // Cost classification options for COMPENSATION OF EMPLOYEES cost category
  const compensationOfEmployeesOptions = [
    'Classified Expenditure',
    'Consultancy Services',
    'Consultancy Services- Capital',
    'Consultancy Services- Recurrent',
    'Employer s Social Contributions-Imputed',
    'Employers Social Contributions',
    'Employers Social Contributions-Actual',
    'Legislative Emoluments',
    'Professional Services',
    'Protective Gear',
    'Relief Supplies',
    'Research Expenses',
    'Supplies and Services',
    'Utility and Property Expenses',
    'Wages and salaries in kind'
  ];
  
  // Cost classification options for CONSUMPTION OF FIXED ASSETS cost category
  const consumptionOfFixedAssetsOptions = [
    'Classified Assets',
    'Furniture and fittings',
    'Gross Tax',
    'ICT Equipment',
    'Laboratory and Research Equipment',
    'Machinery and equipment',
    'Medical Equipment',
    'Non Residential buildings',
    'Office Equipment',
    'Other Fixed Assets',
    'Power lines, stations and plants',
    'Residential buildings',
    'Roads and bridges',
    'Transport equipment'
  ];
  
  // Cost classification options for DOMESTIC LIABILITIES cost category
  const domesticLiabilitiesOptions = [
    'Accountable Advances',
    'Advances from other government units',
    'Advances Received from The Road Fund',
    'Commercial banks',
    'Committed Creditors (Accruals)',
    'Compensation for Graduated Tax (District)',
    'compensation for Graduated Tax (Urban)',
    'Conditional Grant for NAADS (Districts)-Wage',
    'Conditional Grant to LRDP',
    'Conditional Non Wage Transfers for Primary Teachers\' Colleges',
    'Conditional trans for Comm. Devp. Staff Salaries',
    'Conditional trans. Autonomous Inst (Wage subvention',
    'Conditional transfer to environment and natural resources (non-wage)',
    'Conditional transfer to environment and natural resources (wage)',
    'Conditional transfer to women, youth and disability councils',
    'Conditional transfers f or Health Training Institutions',
    'Conditional transfers for Agric Extension',
    'Conditional transfers for Agric. Devp. Centres',
    'Conditional transfers for Agric. Ext Salaries',
    'Conditional transfers for community development',
    'Conditional Transfers for Construction of Secondary Schools',
    'Conditional transfers for Contracts Committee/DSC/PAC/Land Boards, etc.',
    'Conditional transfers for District Hospitals',
    'Conditional transfers for DSC Chairs\' Salaries',
    'Conditional transfers for feeder roads maintenance workshops',
    'Conditional transfers for Functional Adult Lit',
    'Conditional Transfers for Hard to Reach Allowance',
    'Conditional transfers for LGDP',
    'Conditional transfers for NGO Hospitals',
    'Conditional Transfers for Non Wage Community Polytechnics',
    'Conditional Transfers for Non Wage National Health Service Training Colleges',
    'Conditional Transfers for Non Wage Technical & Farm Schools',
    'Conditional Transfers for Non Wage Technical Institutes',
    'Conditional transfers for PAF monitoring',
    'Conditional transfers for PHC - development',
    'Conditional transfers for PHC Salaries',
    'Conditional transfers for PHC- Non wage',
    'Conditional transfers for PMA NSCG',
    'Conditional transfers for Primary Education',
    'Conditional transfers for Primary Salaries',
    'Conditional transfers for Public Libraries',
    'Conditional transfers for Road Maintenance',
    'Conditional transfers for Rural water',
    'Conditional Transfers for Salaries & gratuity for elected political leaders',
    'Conditional transfers for Secondary Salaries',
    'Conditional transfers for Secondary Schools',
    'Conditional transfers for SFG',
    'Conditional transfers for Tertiary Salaries',
    'Conditional Transfers for Urban Equalization Grant',
    'Conditional transfers for Urban Water',
    'Conditional Transfers for Wage Community Polytechnics',
    'Conditional Transfers for Wage National Health Service Training Colleges',
    'Conditional Transfers for Wage Technical & Farm Schools',
    'Conditional Transfers for Wage Technical Institutes',
    'Conditional Transfers to CAO/DCAO & TCs - Wage',
    'Conditional Transfers to Sanitation & Hygiene',
    'Contingency transfers',
    'Deposits Received',
    'Development Grant',
    'District Unconditional grants',
    'Equalisation grants',
    'Government bonds',
    'Interest payable',
    'NAADS',
    'Other',
    'Other grants',
    'Pension arrears_Local Government',
    'Pension arrears – Education service',
    'Pension arrears – General public service',
    'Pension arrears – Military service',
    'Promissory notes',
    'Provision for Bad Debts',
    'Sector Conditional Grant-Non Wage',
    'Sector Conditional Grant-Wage',
    'Start-up costs',
    'Sundry Creditors',
    'Support Service Conditional Grant-Non Wage',
    'Support Services Conditional Grant-Wage',
    'Trade Creditors',
    'Transfer for District Unconditional Grant - Wage',
    'Transfer for Urban Unconditional Grant - Wage',
    'Treasury bills',
    'Urban Unconditional grants',
    'With-holding Tax payable'
  ];
  
  // Cost classification options for EMPLOYEE COSTS cost category
  const employeeCostsOptions = [
    'Allowances (Incl. Casuals, Temporary, sitting allowances)',
    'Boards, Committees and Council Allowances',
    'Contract Staff Salaries',
    'Employee Gratuity',
    'Ex-Gratia for Political leaders.',
    'General Staff Salaries',
    'Gratuity Expenses',
    'Gratuity for Local Governments',
    'Incapacity benefits (Employees)',
    'Incapacity, death benefits and funeral expenses',
    'Medical expenses (Employees)',
    'Medical expenses (To employees)',
    'Pension and Gratuity for Local Governments',
    'Pension for Military Service',
    'Retrenchment costs',
    'Social Security Contributions',
    'Staff Training',
    'Statutory salaries',
    'Validation of old Pensioners'
  ];
  
  // Cost classification options for FINANCIAL ASSETS cost category
  const financialAssetsOptions = [
    'Advances to other govt. units (e.g. Foreign Missions and Embassies)',
    'Cash at Bank',
    'Cash at Hand - Imprest',
    'Cash In Transit',
    'Collection accounts',
    'Compensation for Graduated Tax (District)',
    'Compensation for Graduated Tax (Urban)',
    'Conditional Grant for NAADS (Districts)-Wage',
    'Conditional Grant to LRDP',
    'Conditional Non Wage Transfers for Primary Teachers\' Colleges',
    'Conditional trans to Comm. Development. Staff Salaries',
    'Conditional trans. to Autonomous Inst (Wage subvention',
    'Conditional Transfer for School Inspection',
    'Conditional Transfer to Municipal Infrastructure',
    'Conditional Transfers for Construction of Secondary Schools',
    'Conditional Transfers for Hard to Reach Areas',
    'Conditional Transfers for LLGs\' ex-gratia',
    'Conditional Transfers for Non Wage Community Polytechnics',
    'Conditional Transfers for Non Wage National Health Service Training Colleges',
    'Conditional Transfers for Non Wage Technical & Farm Schools',
    'Conditional Transfers for Non Wage Technical Institutes',
    'Conditional Transfers for Production and marketing',
    'Conditional transfers for Salaries & gratuity for elected political leaders',
    'Conditional Transfers for Wage Community Polytechnics',
    'Conditional Transfers for Wage National Health Service Training Colleges',
    'Conditional Transfers for Wage Technical & Farm Schools',
    'Conditional Transfers for Wage Technical Institutes',
    'Conditional transfers to Agric Extension',
    'Conditional transfers to Agric. Development. Centres',
    'Conditional transfers to Agric. Ext Salaries',
    'Conditional Transfers to CAO/DCAO & TCS - Wage',
    'Conditional transfers to community development',
    'Conditional transfers to Contracts committee/DSC/PAC/Land Boards, etc.',
    'Conditional transfers to District Hospitals',
    'Conditional transfers to DSC Chairs\' Salaries',
    'Conditional transfers to environment and natural resources (non-wage)',
    'Conditional transfers to environment and natural resources (wage)',
    'Conditional transfers to feeder roads maintenance workshops',
    'Conditional transfers to Functional Adult Lit',
    'Conditional transfers to Health Training Institutions',
    'Conditional transfers to LGDP',
    'Conditional transfers to NGO Hospitals',
    'Conditional transfers to PAF monitoring',
    'Conditional transfers to PHC - development',
    'Conditional transfers to PHC Salaries',
    'Conditional transfers to PHC- Non wage',
    'Conditional transfers to PMA NSCG',
    'Conditional transfers to Primary Education',
    'Conditional transfers to Primary Salaries',
    'Conditional transfers to Public Libraries',
    'Conditional transfers to Road Maintenance',
    'Conditional transfers to Rural water',
    'Conditional Transfers to Sanitation & Hygiene',
    'Conditional transfers to Secondary Salaries',
    'Conditional transfers to Secondary Schools',
    'Conditional transfers to SFG',
    'Conditional transfers to Tertiary Salaries',
    'Conditional transfers to Urban Water',
    'Conditional transfers to women, youth and disability councils',
    'Conditional Transfers-Special grant for people with disabilities',
    'Contingency Fund account',
    'Contingency transfers',
    'Corporate bonds',
    'Debentures',
    'Defence/Military Pensions arrears (Budgeting)',
    'Departmental Advances',
    'Development Grant',
    'District Discretionary Development Equalisation grants',
    'District Unconditional grants',
    'Domestic arrears (Budgeting)',
    'DSC Operational Costs - Non wage',
    'Electricity arrears (Budgeting)',
    'Expenditure accounts',
    'External Debt repayment (Budgeting)',
    'Financial derivatives',
    'Fixed Deposits',
    'Government on-lending - Agencies',
    'Government on-lending - State enterprises',
    'Government on-lending- Private entities',
    'Holding accounts',
    'Local Government Pensions arrears (Budgeting)',
    'NAADS',
    'Other Advances',
    'Other grants',
    'Other securities',
    'Others',
    'Pension arrears (Budgeting)',
    'Prepayment to Suppliers',
    'Project accounts',
    'Promissory notes',
    'Revenue accounts',
    'Sector Conditional Grant-Non Wage',
    'Sector Conditional Grant-Wage',
    'Shares in International Organizations',
    'Shares in other entities',
    'Shares in other foreign entities',
    'Shares in public corporations',
    'Staff Advances',
    'Start-up costs',
    'Sundry Debtors',
    'Support Services Conditional Grant -Wage',
    'Support Services Conditional Grant-Non Wage',
    'Taxes Receivable',
    'Teachers\' Pensions arrears (Budgeting)',
    'Telephone arrears (Budgeting)',
    'The Consolidated Fund account',
    'Trade Debtors',
    'Transfer for District Unconditional Grant - Wage',
    'Transfer for Urban Unconditional Grant - Wage',
    'Transitional Development Grant',
    'Treasury Bills Redemption (Budgeting)',
    'Treasury Bonds Redemption (Budgeting)',
    'TSA Holding Account',
    'URA Revenue collection',
    'Urban Discretionary Development Urban Equalization Grant',
    'Urban Unconditional grants',
    'Utility arrears (Budgeting)',
    'Water arrears (Budgeting)'
  ];
  
  // Cost classification options for Foreign cost category
  const foreignOptions = [
    'Classified Assets',
    'Commercial non-banks',
    'Foreign Commercial Banks',
    'Furniture and Fixtures',
    'ICT Equipment',
    'Laboratory and Research Equipment',
    'Loans from Foreign Governments (Bi-lateral)',
    'Machinery and Equipment',
    'Medical Equipment',
    'Multi-laterals',
    'Non-Residential Buildings',
    'Office Equipment',
    'Other Buildings and Structures',
    'Residential Buildings',
    'Roads and Bridges',
    'Transport Equipment (Vehicles)',
    'Uninsured commercial non-banks'
  ];
  
  // Cost classification options for General use of goods and services cost category
  const generalUseOfGoodsAndServicesOptions = [
    'Advertising and Public Relations',
    'Agricultural Supplies and Services',
    'Bad Debts',
    'Bank Charges and other Bank related costs',
    'Beddings, Clothing, Footwear and related Services',
    'Books, Periodicals & Newspapers',
    'Carriage, Haulage, Freight and transport hire',
    'Commissions and related charges',
    'Consultancy Services- Long-term',
    'Consultancy Services- Short term',
    'Discounts Allowed',
    'Electricity',
    'Exchange losses/gains',
    'Financial and related losses',
    'Food Supplies',
    'Fuel, Lubricants and Oils',
    'General use of goods and services',
    'Guard and Security services',
    'Information and Communication Technology Services',
    'Information and Communication Technology Supplies.',
    'Information and communications technology (ICT)',
    'Insurances',
    'Laboratory Supplies and Services',
    'Licenses',
    'Litigation and related expenses',
    'Maintenance - Civil',
    'Maintenance - Vehicles',
    'Maintenance - Machinery, Equipment & Furniture',
    'Maintenance - Other',
    'Medical Supplies and Services',
    'Membership dues and Subscription fees',
    'Official Ceremonies and State Functions',
    'Other Utilities- (fuel, gas, firewood, charcoal)',
    'Postage and Courier',
    'Printing, Stationery, Photocopying and Binding',
    'Property Management Expenses',
    'Property Rates',
    'Recruitment Expenses',
    'Rent - (Produced Assets) to other govt. units',
    'Rent - (Produced Assets) to private entities',
    'Sale of goods purchased for resale',
    'Small Office Equipment',
    'Special Meals and Drinks',
    'Staff Training',
    'Systems Recurrent costs',
    'Taxes on (Professional) Services',
    'Travel abroad',
    'Travel inland',
    'Veterinary Supplies and services',
    'Water',
    'Welfare and Entertainment',
    'Workshops, Meetings and Seminars'
  ];
  
  // Cost classification options for GRANTS cost category
  const grantsOptions = [
    'Compensation for Graduated Tax (District)',
    'Compensation for Graduated Tax (Urban)',
    'Conditional Grant for NAADS (Districts)-Wage',
    'Conditional Grant to LRDP',
    'Conditional Non Wage Transfers for Primary Teachers\' Colleges',
    'Conditional trans for Comm. Devp. Staff Salaries',
    'Conditional trans. Autonomous Inst (Wage subvention',
    'Conditional Transfer for Hard to Reach Allowances',
    'Conditional Transfer for School Inspection',
    'Conditional transfer to environment and natural resources (non-wage)',
    'Conditional transfer to environment and natural resources (wage)',
    'Conditional Transfer to Municipal Infrastructure',
    'Conditional transfer to women, youth and disability councils',
    'Conditional transfers for Health Training Institutions',
    'Conditional transfers for Agric Extension',
    'Conditional transfers for Agric. Devt. Centres',
    'Conditional transfers for Agric. Ext Salaries',
    'Conditional transfers for community development',
    'Conditional Transfers for Construction of Secondary Schools',
    'Conditional transfers for Contracts committee/DSC/PAC/Land Boards',
    'Conditional transfers for District Hospitals',
    'Conditional transfers for DSC Chairs\' Salaries',
    'Conditional transfers for feeder roads maintenance workshops',
    'Conditional transfers for Functional Adult Lit',
    'Conditional transfers for LGDP',
    'Conditional Transfers for LLGs\' ex-gratia',
    'Conditional transfers for NGO Hospitals',
    'Conditional Transfers for Non Wage Community Polytechnics',
    'Conditional Transfers for Non Wage National Health Service Training Colleges',
    'Conditional Transfers for Non Wage Technical & Farm Schools',
    'Conditional Transfers for Non Wage Technical Institutes',
    'Conditional transfers for PAF monitoring',
    'Conditional transfers for PHC - development',
    'Conditional transfers for PHC Salaries',
    'Conditional transfers for PHC- Non wage',
    'Conditional transfers for PMA NSCG',
    'Conditional transfers for Primary Education',
    'Conditional transfers for Primary Salaries',
    'Conditional Transfers for Production and marketing',
    'Conditional transfers for Public Libraries',
    'Conditional transfers for Road Maintenance',
    'Conditional transfers for Rural water',
    'Conditional Transfers for Salaries & gratuity for elected political leaders',
    'Conditional transfers for Secondary Salaries',
    'Conditional transfers for Secondary Schools',
    'Conditional transfers for SFG',
    'Conditional transfers for Tertiary Salaries',
    'Conditional Transfers for Urban Equalization Grant',
    'Conditional transfers for Urban Water',
    'Conditional Transfers for Wage Community Polytechnics',
    'Conditional Transfers for Wage National Health Service Training Colleges',
    'Conditional Transfers for Wage Technical & Farm Schools',
    'Conditional Transfers for Wage Technical Institutes',
    'Conditional Transfers to CAO/DCAO & TCS - Wage',
    'Conditional Transfers to Sanitation & Hygiene',
    'Conditional Transfers-Special grant for people with disabilities',
    'Contributions to Autonomous Institutions',
    'Contributions to Autonomous Institutions (Wage Subventions)',
    'Contributions to Foreign governments',
    'Contributions to International Organisations',
    'Contingency transfers',
    'Development Grant',
    'Grants to Cultural Institutions/ Leaders',
    'LG Conditional grants',
    'LG Equalisation grants',
    'LG Unconditional grants',
    'NAADS',
    'Other Capital grants',
    'Other Current grants',
    'Other grants',
    'Sector Conditional Grant (Non-Wage)',
    'Sector Conditional Grant (Wage)',
    'Transfer for Urban Unconditional Grant - Wage',
    'Transfers to other govt. units',
    'Transfers to Ministries and Agencies',
    'Transfers to Treasury',
    'Treasury Transfers to Agencies',
    'Treasury transfers to Ministries',
    'URA Retentions'
  ];
  
  // Cost classification options for INTEREST PAYABLE cost category
  const interestPayableOptions = [
    'Bonds',
    'Commitment Charges',
    'Interest payable to other Government units',
    'Loan interest',
    'Other',
    'Treasury bills'
  ];
  
  // Cost classification options for OTHER EXPENSES cost category
  const otherExpensesOptions = [
    'Compensation to 3rd Parties',
    'Court Awards',
    'Disposal of Assets (Loss/Gain)',
    'Donations',
    'Engineering and Design Studies & Plans for capital works',
    'Environment Impact Assessment for Capital Works',
    'Extra-Ordinary Items (Losses/Gains)',
    'Feasibility Studies for Capital Works',
    'Fines and Penalties – to other govt units',
    'Fines and Penalties/ Court wards',
    'Monitoring and Supervision of capital work',
    'Monitoring, Supervision & Appraisal of capital work',
    'Rent',
    'Scholarships and related costs'
  ];
  
  // Cost classification options for SOCIAL BENEFITS cost category
  const socialBenefitsOptions = [
    'Incapacity, death benefits and funeral expenses',
    'Medical expenses (To general Public)',
    'Retrenchment costs'
  ];
  
  // Cost classification options for SUBSIDIES cost category
  const subsidiesOptions = [
    'Subsidies and Private Enterprises'
  ];
  
  // Cost classification options for TAX REFUNDS cost category
  const taxRefundsOptions = [
    'Transfers to Government Institutions',
    'Transfers to NGOs',
    'Transfers to Other Private Entities'
  ];
  
  // Cost classification options for USE OF GOODS AND SERVICES cost category
  const useOfGoodsAndServicesOptions = [
    'Communications',
    'Consultancy Services',
    'Consultancy Services- Capital',
    'Consultancy Services- Recurrent',
    'Environment Impact Assessment for Capital Works'
  ];
  
  const defaultCostClassificationOptions = ['Personnel', 'Administration', 'Operations', 'Development'];
  
  // Function to get cost classification options based on selected cost category
  const getCostClassificationOptions = (costCategory) => {
    if (costCategory === 'Assets') {
      return assetsCostClassificationOptions;
    }
    if (costCategory === 'Compensation of Employees') {
      return compensationOfEmployeesOptions;
    }
    if (costCategory === 'Consumption of Fixed Assets') {
      return consumptionOfFixedAssetsOptions;
    }
    if (costCategory === 'Domestic Liabilities') {
      return domesticLiabilitiesOptions;
    }
    if (costCategory === 'Employee Costs') {
      return employeeCostsOptions;
    }
    if (costCategory === 'Financial Assets') {
      return financialAssetsOptions;
    }
    if (costCategory === 'Foreign Cost') {
      return foreignOptions;
    }
    if (costCategory === 'General use of goods and services') {
      return generalUseOfGoodsAndServicesOptions;
    }
    if (costCategory === 'Grants') {
      return grantsOptions;
    }
    if (costCategory === 'Interest Payable') {
      return interestPayableOptions;
    }
    if (costCategory === 'Other Expenses') {
      return otherExpensesOptions;
    }
    if (costCategory === 'Social Benefits') {
      return socialBenefitsOptions;
    }
    if (costCategory === 'Subsidies') {
      return subsidiesOptions;
    }
    if (costCategory === 'Tax Refunds') {
      return taxRefundsOptions;
    }
    if (costCategory === 'Use of Goods & Services') {
      return useOfGoodsAndServicesOptions;
    }
    // Add more conditions for other cost categories as needed
    return defaultCostClassificationOptions;
  };
  const procurementMethodOptions = ['Indirect procurement', 'Direct procurement', 'Services procurement'];

  const [errors, setErrors] = useState({});
  const [activityOutputsOptions, setActivityOutputsOptions] = useState([]);
  const [hasFetchedActivityOutputs, setHasFetchedActivityOutputs] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch Activity Outputs from PBS API
  const fetchActivityOutputs = async (projectCode) => {
    if (!projectCode || projectCode === 'N/A') return;
    
    // Check if we've already fetched for this project in this session
    const cacheKey = `activityOutputs_${projectCode}`;
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        setActivityOutputsOptions(parsedData);
        setHasFetchedActivityOutputs(true);
        return;
      } catch (error) {
        console.warn('Error parsing cached activity outputs:', error);
        // Continue to fetch if cache is invalid
      }
    }
    
    // Don't fetch if we've already fetched (unless cache is invalid)
    if (hasFetchedActivityOutputs) {
      return;
    }

    try {
      setLoadingActivityOutputs(true);

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

      // Then fetch the PBS budget allocations data
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

      const fetchedData = dataResponse.data.data.cgIbpProjectBudgetAllocations || [];
      
      // Filter data for the specific project
      const projectData = fetchedData.filter(item => item.Project_Code === projectCode);
      
      // Extract unique Description values - normalize and remove duplicates
      // Use a Set with normalized (trimmed, case-insensitive) values to catch all duplicates
      const seen = new Set();
      const uniqueDescriptions = [];
      
      projectData.forEach(item => {
        if (item.Description && typeof item.Description === 'string') {
          // Normalize: trim whitespace and convert to lowercase for comparison
          const normalized = item.Description.trim().toLowerCase();
          const original = item.Description.trim();
          
          // Only add if we haven't seen this normalized value before
          if (normalized && !seen.has(normalized)) {
            seen.add(normalized);
            uniqueDescriptions.push(original); // Store the original (trimmed) value
          }
        }
      });
      
      // Sort alphabetically (case-insensitive)
      uniqueDescriptions.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      
      console.log('Activity Outputs - Unique count:', uniqueDescriptions.length, 'from', projectData.length, 'total items');
      console.log('Activity Outputs options:', uniqueDescriptions);
      
      // Cache the results in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify(uniqueDescriptions));
      
      setActivityOutputsOptions(uniqueDescriptions);
      setHasFetchedActivityOutputs(true);
      setLoadingActivityOutputs(false);
    } catch (error) {
      console.error("Error fetching Activity Outputs from PBS API:", error);
      setLoadingActivityOutputs(false);
      // Optionally set empty array or show error message
      setActivityOutputsOptions([]);
    }
  };

  // Fetch project data if available
  useEffect(() => {
    if (location.state?.projectData) {
      setProjectData(location.state.projectData);
      // Fetch activity outputs when project data is available
      if (location.state.projectData.code) {
        fetchActivityOutputs(location.state.projectData.code);
      }
    } else if (id) {
      // Try to get from cache
      const cacheKey = 'pbsProjectsData';
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const pbsProjects = JSON.parse(cachedData);
          const projectPbsData = pbsProjects.find(item => item.Project_Code === id);
          if (projectPbsData) {
            const projectDataObj = {
              code: projectPbsData.Project_Code || id,
              title: projectPbsData.Project_Name || 'Project Title Not Available',
            };
            setProjectData(projectDataObj);
            // Fetch activity outputs
            fetchActivityOutputs(projectDataObj.code);
          }
        } catch (error) {
          console.error('Error parsing cached data:', error);
        }
      } else {
        // If no cache, still try to fetch activity outputs with the id
        fetchActivityOutputs(id);
      }
    }
  }, [id, location.state]);

  const validateForm = () => {
    const newErrors = {};
    
    activities.forEach((activity, index) => {
      // Validate basic activity fields
      if (!activity.activityName || !activity.activityName.trim()) {
        newErrors[`activityName_${index}`] = 'Activity Name is required';
      }
      
      if (!activity.startDate || (activity.startDate && typeof activity.startDate.isValid === 'function' && !activity.startDate.isValid())) {
        newErrors[`startDate_${index}`] = 'Start date is required';
      }
      
      if (!activity.endDate || (activity.endDate && typeof activity.endDate.isValid === 'function' && !activity.endDate.isValid())) {
        newErrors[`endDate_${index}`] = 'End date is required';
      }
      
      if (activity.startDate && activity.endDate && typeof activity.startDate.isValid === 'function' && typeof activity.endDate.isValid === 'function') {
        if (activity.startDate.isValid() && activity.endDate.isValid() && activity.endDate.isBefore(activity.startDate)) {
          newErrors[`endDate_${index}`] = 'End date must be after start date';
        }
      }
      
      if (!activity.activityOutputs || activity.activityOutputs.length === 0) {
        newErrors[`activityOutputs_${index}`] = 'Activity Outputs is required';
      }
      
      if (!activity.activityDescription || !activity.activityDescription.trim()) {
        newErrors[`activityDescription_${index}`] = 'Activity Description is required';
      }

      // Validate cost details if activity name is filled
      if (activity.activityName && activity.activityName.trim()) {
        if (!activity.fund || !activity.fund.trim()) {
          newErrors[`fund_${index}`] = 'Fund is required';
        }
        
        if (!activity.fundSource || !activity.fundSource.trim()) {
          newErrors[`fundSource_${index}`] = 'Fund Source is required';
        }
        
        if (!activity.costCategory || !activity.costCategory.trim()) {
          newErrors[`costCategory_${index}`] = 'Cost Category is required';
        }
        
        if (!activity.costClassification || !activity.costClassification.trim()) {
          newErrors[`costClassification_${index}`] = 'Cost Classification is required';
        }
        
        if (!activity.procurementMethod || !activity.procurementMethod.trim()) {
          newErrors[`procurementMethod_${index}`] = 'Procurement Method is required';
        }
        
        if (!activity.procurementStartDate || (activity.procurementStartDate && typeof activity.procurementStartDate.isValid === 'function' && !activity.procurementStartDate.isValid())) {
          newErrors[`procurementStartDate_${index}`] = 'Procurement Start Date is required';
        }
        
        if (!activity.contractSignDate || (activity.contractSignDate && typeof activity.contractSignDate.isValid === 'function' && !activity.contractSignDate.isValid())) {
          newErrors[`contractSignDate_${index}`] = 'Contract Sign Date is required';
        }
        
        if (activity.procurementStartDate && activity.contractSignDate && typeof activity.procurementStartDate.isValid === 'function' && typeof activity.contractSignDate.isValid === 'function') {
          if (activity.procurementStartDate.isValid() && activity.contractSignDate.isValid() && activity.contractSignDate.isBefore(activity.procurementStartDate)) {
            newErrors[`contractSignDate_${index}`] = 'Contract Sign Date must be after Procurement Start Date';
          }
        }
        
        if (!activity.procurementDetails || !activity.procurementDetails.trim()) {
          newErrors[`procurementDetails_${index}`] = 'Procurement Details is required';
        }
        
        if (!activity.amount || !activity.amount.trim()) {
          newErrors[`amount_${index}`] = 'Amount is required';
        } else if (isNaN(parseFloat(activity.amount)) || parseFloat(activity.amount) <= 0) {
          newErrors[`amount_${index}`] = 'Amount must be a valid positive number';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSingleActivity = (activity, index) => {
    const newErrors = {};
    
    if (!activity.activityName || !activity.activityName.trim()) {
      newErrors[`activityName_${index}`] = 'Activity Name is required';
    }
    
    if (!activity.startDate || (activity.startDate && typeof activity.startDate.isValid === 'function' && !activity.startDate.isValid())) {
      newErrors[`startDate_${index}`] = 'Start date is required';
    }
    
    if (!activity.endDate || (activity.endDate && typeof activity.endDate.isValid === 'function' && !activity.endDate.isValid())) {
      newErrors[`endDate_${index}`] = 'End date is required';
    }
    
    if (activity.startDate && activity.endDate && typeof activity.startDate.isValid === 'function' && typeof activity.endDate.isValid === 'function') {
      if (activity.startDate.isValid() && activity.endDate.isValid() && activity.endDate.isBefore(activity.startDate)) {
        newErrors[`endDate_${index}`] = 'End date must be after start date';
      }
    }
    
    if (!activity.activityOutputs || activity.activityOutputs.length === 0) {
      newErrors[`activityOutputs_${index}`] = 'Activity Outputs is required';
    }
    
    if (!activity.activityDescription || !activity.activityDescription.trim()) {
      newErrors[`activityDescription_${index}`] = 'Activity Description is required';
    }
    
    return newErrors;
  };

  const addActivity = () => {
    // Validate the last activity (current one being filled)
    const lastIndex = activities.length - 1;
    const lastActivity = activities[lastIndex];
    const activityErrors = validateSingleActivity(lastActivity, lastIndex);
    
    // If there are errors, show them and don't add a new activity
    if (Object.keys(activityErrors).length > 0) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ...activityErrors
      }));
      // Scroll to first error field
      const firstErrorField = Object.keys(activityErrors)[0];
      const fieldId = firstErrorField.split('_')[0];
      const errorIndex = firstErrorField.split('_')[1];
      setTimeout(() => {
        const element = document.querySelector(`[data-activity-index="${errorIndex}"][data-field="${fieldId}"]`);
        const scrollContainer = formScrollRef.current;
        
        if (element && scrollContainer) {
          // Calculate scroll position relative to the scroll container
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const scrollTop = scrollContainer.scrollTop;
          const elementTop = elementRect.top - containerRect.top + scrollTop;
          
          // Scroll the container to center the element
          scrollContainer.scrollTo({
            top: elementTop - (containerRect.height / 2) + (elementRect.height / 2),
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }
    
    // Clear any errors for the last activity since it's valid
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(key => {
      if (key.endsWith(`_${lastIndex}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
    
    // All fields are filled, add a new empty activity
    const newActivityIndex = activities.length;
    setActivities([...activities, {
      activityName: '',
      startDate: null,
      endDate: null,
      activityOutputs: [],
      activityDescription: '',
      // Cost details
      costPlanActivity: '',
      fund: '',
      fundSource: '',
      costCategory: '',
      costClassification: '',
      procurementMethod: '',
      procurementStartDate: null,
      contractSignDate: null,
      procurementDetails: '',
      amount: ''
    }]);
    
    // Scroll to the new activity form after it's rendered
    setTimeout(() => {
      const newActivityElement = document.querySelector(`[data-activity-box="${newActivityIndex}"]`);
      const scrollContainer = formScrollRef.current;
      
      if (newActivityElement && scrollContainer) {
        // Calculate scroll position relative to the scroll container
        const containerRect = scrollContainer.getBoundingClientRect();
        const elementRect = newActivityElement.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const elementTop = elementRect.top - containerRect.top + scrollTop;
        
        // Get buttons container to ensure it's visible
        const buttonsContainer = document.querySelector('[data-buttons-container]');
        const buttonsHeight = buttonsContainer ? buttonsContainer.offsetHeight : 80;
        
        // Calculate max scroll to ensure buttons remain visible
        const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const desiredScrollTop = elementTop - 100; // 100px offset from top
        
        // Ensure we don't scroll past the point where buttons would be hidden
        const finalScrollTop = Math.min(desiredScrollTop, maxScrollTop - buttonsHeight - 20);
        
        // Scroll the container, not the window
        scrollContainer.scrollTo({
          top: Math.max(0, finalScrollTop),
          behavior: 'smooth'
        });
        
        // Also focus on the first field after scroll completes
        setTimeout(() => {
          const firstInput = newActivityElement.querySelector('input[type="text"]');
          if (firstInput) {
            firstInput.focus();
          }
        }, 500);
      }
    }, 150);
  };

  const removeActivity = (index) => {
    if (activities.length > 1) {
      const newActivities = activities.filter((_, i) => i !== index);
      setActivities(newActivities);
      // Clear errors for removed activity
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.endsWith(`_${index}`)) {
          delete newErrors[key];
        }
      });
      // Reindex remaining errors
      const reindexedErrors = {};
      Object.keys(newErrors).forEach(key => {
        const [field, oldIndex] = key.split('_');
        const oldIdx = parseInt(oldIndex);
        if (oldIdx > index) {
          reindexedErrors[`${field}_${oldIdx - 1}`] = newErrors[key];
        } else {
          reindexedErrors[key] = newErrors[key];
        }
      });
      setErrors(reindexedErrors);
    }
  };

  const updateActivity = (index, field, value) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    
    // If fund changes, reset fundSource to empty
    if (field === 'fund') {
      newActivities[index].fundSource = '';
    }
    
    // If costCategory changes, reset costClassification to empty
    if (field === 'costCategory') {
      newActivities[index].costClassification = '';
    }
    
    setActivities(newActivities);
    
    // Clear error for this field
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };
  
  const toggleCostSection = (index) => {
    setExpandedCostSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper function to fetch fund ID by name
  const fetchFundId = async (fundName, fundSourceName) => {
    if (!fundName && !fundSourceName) {
      return null;
    }
    
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.get(`${API_URL}/funds`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          per_page: 1000, // Get all funds to search
        },
      });

      // Search for fund by name (fundName is the parent, fundSourceName is the child)
      const funds = response.data?.data || response.data || [];
      
      console.log(`Searching for fund: "${fundName}" / "${fundSourceName}" in ${funds.length} funds`);
      
      // First, try to find by fundSourceName (more specific)
      let foundFund = null;
      
      if (fundSourceName) {
        foundFund = funds.find(f => 
          f.name && f.name.trim().toLowerCase() === fundSourceName.trim().toLowerCase()
        );
        if (foundFund) {
          console.log(`  ✓ Found fund by fundSourceName: "${fundSourceName}" -> ID: ${foundFund.id}`);
          return foundFund.id;
        }
      }
      
      // If not found by fundSourceName, try fundName
      if (fundName) {
        foundFund = funds.find(f => 
          f.name && f.name.trim().toLowerCase() === fundName.trim().toLowerCase()
        );
        if (foundFund) {
          console.log(`  ✓ Found fund by fundName: "${fundName}" -> ID: ${foundFund.id}`);
          return foundFund.id;
        }
      }
      
      console.warn(`  ✗ Fund not found: "${fundName}" / "${fundSourceName}"`);
      return null;
    } catch (error) {
      console.warn('⚠ Error fetching fund ID:', error);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
        if (error.response.status === 401) {
          // Token expired - will be handled by main error handler
          console.error('⚠ Authentication token expired while fetching fund ID');
          throw error; // Re-throw to be handled by main error handler
        }
      }
      // Return null on error - will use default fund_id
      return null;
    }
  };

  // Helper function to fetch costing ID by category and classification
  const fetchCostingId = async (costCategory, costClassification) => {
    if (!costCategory && !costClassification) {
      return null;
    }
    
    try {
      const token = localStorage.getItem(TOKEN);
      const response = await axios.get(`${API_URL}/costings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          per_page: 1000, // Get all costings to search
        },
      });

      const costings = response.data?.data || response.data || [];
      
      console.log(`Searching for costing: "${costCategory}" / "${costClassification}" in ${costings.length} costings`);
      
      // Try to find costing by name (costClassification is more specific)
      let costing = null;
      
      if (costClassification) {
        costing = costings.find(c => 
          c.name && c.name.trim().toLowerCase() === costClassification.trim().toLowerCase()
        );
        if (costing) {
          console.log(`  ✓ Found costing by costClassification: "${costClassification}" -> ID: ${costing.id}`);
          return costing.id;
        }
      }
      
      // If not found by costClassification, try costCategory
      if (costCategory) {
        costing = costings.find(c => 
          c.name && c.name.trim().toLowerCase() === costCategory.trim().toLowerCase()
        );
        if (costing) {
          console.log(`  ✓ Found costing by costCategory: "${costCategory}" -> ID: ${costing.id}`);
          return costing.id;
        }
      }
      
      console.warn(`  ✗ Costing not found: "${costCategory}" / "${costClassification}"`);
      return null;
    } catch (error) {
      console.warn('⚠ Error fetching costing ID:', error);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
        if (error.response.status === 401) {
          // Token expired - will be handled by main error handler
          console.error('⚠ Authentication token expired while fetching costing ID');
          throw error; // Re-throw to be handled by main error handler
        }
      }
      // Return null on error - will use default costing_id
      return null;
    }
  };

  // Helper function to fetch output IDs by descriptions
  const fetchOutputIds = async (outputDescriptions) => {
    if (!outputDescriptions || outputDescriptions.length === 0) {
      return [];
    }
    
    try {
      const token = localStorage.getItem(TOKEN);
      // Outputs endpoint requires project_detail_id filter as JSON string
      const filterParam = JSON.stringify({ project_detail_id: parseInt(id) });
      const response = await axios.get(`${API_URL}/outputs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          per_page: 1000,
          filter: filterParam, // Required filter as JSON string
        },
      });

      const outputs = response.data?.data || response.data || [];
      const outputIds = [];
      
      console.log(`Searching for ${outputDescriptions.length} output descriptions in ${outputs.length} outputs`);
      
      if (outputs.length === 0) {
        console.warn(`⚠ No outputs found for project_detail_id ${parseInt(id)}. This might be normal if outputs haven't been created yet.`);
      }
      
      outputDescriptions.forEach(desc => {
        // Try to match by description or name (case-insensitive)
        const output = outputs.find(o => 
          (o.description && o.description.trim().toLowerCase() === desc.trim().toLowerCase()) ||
          (o.name && o.name.trim().toLowerCase() === desc.trim().toLowerCase())
        );
        if (output) {
          outputIds.push(output.id);
          console.log(`  ✓ Found output: "${desc}" -> ID: ${output.id}`);
        } else {
          console.warn(`  ✗ Output not found: "${desc}"`);
        }
      });
      
      console.log(`Found ${outputIds.length} matching output IDs out of ${outputDescriptions.length} descriptions`);
      return outputIds;
    } catch (error) {
      console.warn('⚠ Error fetching output IDs:', error);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
        if (error.response.status === 401) {
          // Token expired - will be handled by main error handler
          console.error('⚠ Authentication token expired while fetching outputs');
          throw error; // Re-throw to be handled by main error handler
        }
        if (error.response.status === 404) {
          console.warn('⚠ Project detail or outputs not found. This is OK - will use default output IDs.');
        }
      }
      // Return empty array on error - will use default [1] for output_ids
      // This allows the save to continue even if outputs can't be fetched
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== SAVE & EXIT BUTTON CLICKED ===');
    console.log('Current activities state:', activities);
    
    // Validate and get errors
    const newErrors = {};
    
    activities.forEach((activity, index) => {
      // Only validate activities that have been started (have an activity name)
      // Skip empty template activities
      const hasActivityName = activity.activityName && activity.activityName.trim();
      
      if (!hasActivityName) {
        // Skip validation for empty activities (template for adding new ones)
        return;
      }

      // Validate basic activity fields only if activity has been started
      if (!activity.startDate || (activity.startDate && typeof activity.startDate.isValid === 'function' && !activity.startDate.isValid())) {
        newErrors[`startDate_${index}`] = 'Start date is required';
      }
      
      if (!activity.endDate || (activity.endDate && typeof activity.endDate.isValid === 'function' && !activity.endDate.isValid())) {
        newErrors[`endDate_${index}`] = 'End date is required';
      }
      
      if (activity.startDate && activity.endDate && typeof activity.startDate.isValid === 'function' && typeof activity.endDate.isValid === 'function') {
        if (activity.startDate.isValid() && activity.endDate.isValid() && activity.endDate.isBefore(activity.startDate)) {
          newErrors[`endDate_${index}`] = 'End date must be after start date';
        }
      }
      
      // Check if activityOutputs is a valid array with items
      // Handle null, undefined, empty array, or non-array values
      const outputs = activity.activityOutputs;
      
      console.log(`[Validation] Activity ${index} - activityOutputs value:`, outputs);
      console.log(`[Validation] Activity ${index} - activityOutputs type:`, typeof outputs);
      console.log(`[Validation] Activity ${index} - isArray:`, Array.isArray(outputs));
      
      // Check if we have a valid array with at least one non-empty item
      let hasValidOutputs = false;
      
      if (outputs) {
        if (Array.isArray(outputs)) {
          if (outputs.length > 0) {
            // Check if at least one item is non-empty
            hasValidOutputs = outputs.some(item => {
              if (!item) return false;
              if (typeof item === 'string') {
                return item.trim().length > 0;
              }
              return true; // Non-string items are considered valid
            });
            console.log(`[Validation] Activity ${index} - hasValidOutputs:`, hasValidOutputs, `(array length: ${outputs.length})`);
          } else {
            console.log(`[Validation] Activity ${index} - Empty array`);
          }
        } else {
          console.log(`[Validation] Activity ${index} - Not an array:`, outputs);
        }
      } else {
        console.log(`[Validation] Activity ${index} - outputs is null/undefined`);
      }
      
      if (!hasValidOutputs) {
        console.log(`[Validation] Activity ${index} - Setting error for activityOutputs`);
        newErrors[`activityOutputs_${index}`] = 'Activity Outputs is required';
      } else {
        console.log(`[Validation] Activity ${index} - activityOutputs is valid`);
      }
      
      if (!activity.activityDescription || !activity.activityDescription.trim()) {
        newErrors[`activityDescription_${index}`] = 'Activity Description is required';
      }

      // Validate cost details if activity name is filled
      if (hasActivityName) {
        if (!activity.fund || !activity.fund.trim()) {
          newErrors[`fund_${index}`] = 'Fund is required';
        }
        
        if (!activity.fundSource || !activity.fundSource.trim()) {
          newErrors[`fundSource_${index}`] = 'Fund Source is required';
        }
        
        if (!activity.costCategory || !activity.costCategory.trim()) {
          newErrors[`costCategory_${index}`] = 'Cost Category is required';
        }
        
        if (!activity.costClassification || !activity.costClassification.trim()) {
          newErrors[`costClassification_${index}`] = 'Cost Classification is required';
        }
        
        if (!activity.procurementMethod || !activity.procurementMethod.trim()) {
          newErrors[`procurementMethod_${index}`] = 'Procurement Method is required';
        }
        
        if (!activity.procurementStartDate || (activity.procurementStartDate && typeof activity.procurementStartDate.isValid === 'function' && !activity.procurementStartDate.isValid())) {
          newErrors[`procurementStartDate_${index}`] = 'Procurement Start Date is required';
        }
        
        if (!activity.contractSignDate || (activity.contractSignDate && typeof activity.contractSignDate.isValid === 'function' && !activity.contractSignDate.isValid())) {
          newErrors[`contractSignDate_${index}`] = 'Contract Sign Date is required';
        }
        
        if (activity.procurementStartDate && activity.contractSignDate && typeof activity.procurementStartDate.isValid === 'function' && typeof activity.contractSignDate.isValid === 'function') {
          if (activity.procurementStartDate.isValid() && activity.contractSignDate.isValid() && activity.contractSignDate.isBefore(activity.procurementStartDate)) {
            newErrors[`contractSignDate_${index}`] = 'Contract Sign Date must be after Procurement Start Date';
          }
        }
        
        if (!activity.procurementDetails || !activity.procurementDetails.trim()) {
          newErrors[`procurementDetails_${index}`] = 'Procurement Details is required';
        }
        
        if (!activity.amount || !activity.amount.trim()) {
          newErrors[`amount_${index}`] = 'Amount is required';
        } else if (isNaN(parseFloat(activity.amount)) || parseFloat(activity.amount) <= 0) {
          newErrors[`amount_${index}`] = 'Amount must be a valid positive number';
        }
      }
    });
    
    setErrors(newErrors);
    
    console.log('Validation errors found:', Object.keys(newErrors).length);
    if (Object.keys(newErrors).length > 0) {
      console.log('Validation failed. Errors:', newErrors);
      console.log('Full errors object:', newErrors);
      
      // Check if activityOutputs error is incorrectly set
      const activityOutputsErrors = Object.keys(newErrors).filter(key => key.startsWith('activityOutputs_'));
      if (activityOutputsErrors.length > 0) {
        console.warn('⚠ Activity Outputs errors detected:', activityOutputsErrors);
        activityOutputsErrors.forEach(errorKey => {
          const errorIndex = errorKey.split('_')[1];
          const activity = activities[errorIndex];
          console.warn(`  Activity ${errorIndex} outputs:`, activity?.activityOutputs);
        });
      }
      
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields before saving.',
        severity: 'error'
      });
      
      // Scroll to first error (but don't focus if it's incorrectly identified)
      const firstErrorKey = Object.keys(newErrors)[0];
      if (firstErrorKey) {
        const [field, index] = firstErrorKey.split('_');
        console.log(`Scrolling to first error: ${field} at index ${index}`);
        
        setTimeout(() => {
          // Try to find element by data attributes first
          let element = document.querySelector(`[data-activity-index="${index}"][data-field="${field}"]`);
          
          // If not found, try to find the parent input or the field container
          if (!element) {
            // For Autocomplete fields, try to find the input element
            const activityBox = document.querySelector(`[data-activity-box="${index}"]`);
            if (activityBox) {
              // Try to find the field by label or other means
              const labels = activityBox.querySelectorAll('label');
              labels.forEach(label => {
                if (label.textContent.toLowerCase().includes(field.toLowerCase().replace(/([A-Z])/g, ' $1').trim())) {
                  const input = label.closest('.MuiFormControl-root')?.querySelector('input, textarea, .MuiAutocomplete-inputRoot');
                  if (input) {
                    element = input;
                  }
                }
              });
            }
          }
          
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Don't auto-focus to avoid browser validation popup
            // Only scroll, don't focus
          } else {
            console.warn(`Could not find element for error field: ${field} at index ${index}`);
          }
        }, 100);
      }
      return;
    }
    
    console.log('✓ Validation passed - no errors found');
    
    setLoading(true);
    console.log('Starting save process...');
    
    try {
      const token = localStorage.getItem(TOKEN);
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      console.log('✓ Authentication token found');

      // Declare finalProjectDetailId in outer scope for error handler access
      let finalProjectDetailId = null;

      // The 'id' from URL params is actually the project code (PBS code), not project_detail_id
      // We need to find the actual project_detail_id from the project code
      // For PBS projects, we need to check if there's a linked project_detail
      console.log(`\n🔍 Looking up project_detail_id for project code: ${id}`);
      
      let actualProjectDetailId = null;
      
      // Try to find project_detail_id from the project code
      // First, check if there's project data in location.state that might have the ID
      if (location.state?.projectData?.id) {
        actualProjectDetailId = location.state.projectData.id;
        console.log(`✓ Found project_detail_id from location.state: ${actualProjectDetailId}`);
      } else {
        // Try to find via project lookup using the code
        try {
          const token = localStorage.getItem(TOKEN);
          // Try to find project by code/budget_code
          const projectsResponse = await axios.get(`${API_URL}/projects`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            params: {
              per_page: 100,
              filter: JSON.stringify({ budget_code: id })
            },
          });
          
          const projects = projectsResponse.data?.data || projectsResponse.data || [];
          if (projects.length > 0) {
            const project = projects[0];
            // Get project_details for this project
            if (project.id) {
              const projectDetailsResponse = await axios.get(`${API_URL}/project-details`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                params: {
                  per_page: 100,
                  filter: JSON.stringify({ project_id: project.id })
                },
              });
              
              const projectDetails = projectDetailsResponse.data?.data || projectDetailsResponse.data || [];
              if (projectDetails.length > 0) {
                actualProjectDetailId = projectDetails[0].id;
                console.log(`✓ Found project_detail_id: ${actualProjectDetailId} for project code: ${id}`);
              }
            }
          }
        } catch (lookupError) {
          console.warn('⚠ Could not lookup project_detail_id, will use project code as-is:', lookupError);
          // If lookup fails, use the id as-is (might work if it's already a project_detail_id)
          actualProjectDetailId = parseInt(id) || id;
        }
      }
      
      // Use the found project_detail_id, or fall back to the original id
      finalProjectDetailId = actualProjectDetailId || parseInt(id) || id;
      console.log(`✓ Using project_detail_id: ${finalProjectDetailId}`);

      // Filter only activities with names (completed activities)
      const validActivities = activities.filter(act => act.activityName && act.activityName.trim());
      console.log(`✓ Found ${validActivities.length} valid activities to save`);
      console.log('Valid activities:', validActivities);
      
      if (validActivities.length === 0) {
        throw new Error('Please add at least one activity with all required fields.');
      }

      // Prepare cost plan activities and items
      const costPlanActivities = [];
      const costPlanItems = [];

      console.log('Processing activities and fetching related data...');
      
      // Process each activity and create corresponding cost plan items
      for (let i = 0; i < validActivities.length; i++) {
        const activity = validActivities[i];
        console.log(`\n--- Processing Activity ${i + 1}: ${activity.activityName} ---`);
        
        // Fetch output IDs
        console.log(`Fetching output IDs for activity outputs:`, activity.activityOutputs);
        const outputIds = await fetchOutputIds(activity.activityOutputs || []);
        console.log(`✓ Found ${outputIds.length} output IDs:`, outputIds);
        
        // Create cost plan activity
        const costPlanActivity = {
          name: activity.activityName.trim(),
          description: activity.activityDescription?.trim() || '',
          start_date: activity.startDate?.format('YYYY-MM-DD'),
          end_date: activity.endDate?.format('YYYY-MM-DD'),
          output_ids: outputIds.length > 0 ? outputIds : [1], // Default to [1] if no outputs found
        };
        
        console.log('Cost plan activity to save:', costPlanActivity);
        costPlanActivities.push(costPlanActivity);

        // Fetch fund ID and costing ID for cost plan item
        console.log(`Fetching fund ID for: ${activity.fund} / ${activity.fundSource}`);
        const fundId = await fetchFundId(activity.fund, activity.fundSource);
        console.log(`✓ Fund ID:`, fundId || 'NOT FOUND (using default)');
        
        console.log(`Fetching costing ID for: ${activity.costCategory} / ${activity.costClassification}`);
        const costingId = await fetchCostingId(activity.costCategory, activity.costClassification);
        console.log(`✓ Costing ID:`, costingId || 'NOT FOUND (using default)');
        
        if (!fundId) {
          console.warn(`⚠ Fund ID not found for: ${activity.fund} / ${activity.fundSource} - using default`);
        }
        
        if (!costingId) {
          console.warn(`⚠ Costing ID not found for: ${activity.costCategory} / ${activity.costClassification} - using default`);
        }

        // Create cost plan item - will be linked to activity by index after backend creates activities
        // The backend signal handler creates activities first, then items, linking them by order
        const costPlanItem = {
          amount: activity.amount?.toString() || '0',
          fund_id: fundId || 1, // Default to 1 if not found
          costing_id: costingId || 1, // Default to 1 if not found
          procurement_method: activity.procurementMethod || '',
          procurement_start_date: activity.procurementStartDate?.format('YYYY-MM-DD') || null,
          contract_signed_date: activity.contractSignDate?.format('YYYY-MM-DD') || null,
          procurement_details: activity.procurementDetails?.trim() || '',
        };
        
        console.log('Cost plan item to save:', costPlanItem);
        costPlanItems.push(costPlanItem);
      }

      // Get current fiscal year
      const currentYear = getCurrentFiscalYear();
      console.log(`\n✓ Current fiscal year: ${currentYear}`);
      console.log(`✓ Using project_detail_id: ${finalProjectDetailId} (from project code: ${id})`);

      // Prepare the cost plan data
      const costPlanData = {
        year: currentYear,
        project_detail_id: typeof finalProjectDetailId === 'number' ? finalProjectDetailId : parseInt(finalProjectDetailId),
        cost_plan_activities: costPlanActivities,
        cost_plan_items: costPlanItems,
      };

      console.log('\n=== PREPARED COST PLAN DATA ===');
      console.log('Cost Plan Data:', JSON.stringify(costPlanData, null, 2));
      console.log(`Total activities: ${costPlanActivities.length}`);
      console.log(`Total cost items: ${costPlanItems.length}`);

      // Save to API
      console.log(`\n📤 Sending POST request to: ${API_URL}/cost-plans`);
      console.log('Request payload:', JSON.stringify(costPlanData, null, 2));
      
      let response;
      try {
        response = await axios.post(
          `${API_URL}/cost-plans`,
          costPlanData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('✓ API Response received:', response.status, response.statusText);
        console.log('Response data:', response.data);
        } catch (postError) {
        console.error('✗ POST request failed:', postError);
        if (postError.response) {
          console.error('Response status:', postError.response.status);
          console.error('Response data:', postError.response.data);
          console.error('Response headers:', postError.response.headers);
          
          // Provide more specific error messages
          if (postError.response.status === 404) {
            const errorMsg = postError.response.data?.message || 'Record not found';
            if (errorMsg.includes('Record not found')) {
              // Check if this might be a PBS project that hasn't been saved to project_details yet
              console.warn(`⚠ Project detail ID ${finalProjectDetailId || id} not found in database. This may be a PBS project that needs to be saved first.`);
              throw new Error(
                `Unable to save cost plan. The project (code: ${id}, project_detail_id: ${finalProjectDetailId || id}) may not be saved in the database yet. ` +
                `Projects from the PBS API need to be linked to a project and have a project_detail record before creating cost plans. ` +
                `Please ensure the project is properly saved and linked in the system first, or contact your administrator.`
              );
            }
          } else if (postError.response.status === 403) {
            throw new Error(
              `Permission denied. You do not have permission to create cost plans. ` +
              `Please contact your administrator.`
            );
          }
        }
        throw postError; // Re-throw to be caught by outer catch block
      }

      // Check if save was successful
      if (response.data && response.data.id) {
        const savedCostPlan = response.data;
        console.log(`\n✓ Cost plan saved successfully! ID: ${savedCostPlan.id}`);
        
        // Try to link cost plan items to their corresponding activities
        // The backend creates activities first, then items, so we link them by matching order
        try {
          console.log(`\n🔗 Linking cost plan items to activities...`);
          // Fetch the full cost plan with activities and items to get their IDs
          console.log(`Fetching full cost plan data for ID: ${savedCostPlan.id}`);
          const fullCostPlanResponse = await axios.get(
            `${API_URL}/cost-plans/${savedCostPlan.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          console.log('✓ Full cost plan fetched:', fullCostPlanResponse.data);
          
          if (fullCostPlanResponse.data) {
            const fullCostPlan = fullCostPlanResponse.data;
            const activities = fullCostPlan.cost_plan_activities || [];
            const items = fullCostPlan.cost_plan_items || [];
            
            console.log(`Found ${activities.length} activities and ${items.length} items to link`);
            
            // Link items to activities by index (each item corresponds to activity at same index)
            if (activities.length > 0 && items.length > 0) {
              const itemsToLink = items.filter((item, itemIndex) => itemIndex < activities.length && !item.cost_plan_activity_id);
              console.log(`Linking ${itemsToLink.length} items to activities...`);
              
              const updatePromises = items
                .filter((item, itemIndex) => itemIndex < activities.length && !item.cost_plan_activity_id)
                .map((item, itemIndex) => {
                  const activity = activities[itemIndex];
                  if (activity && activity.id) {
                    console.log(`  Linking item ${item.id} to activity ${activity.id} (${activity.name})`);
                    return axios.patch(
                      `${API_URL}/cost-plan-items/${item.id}`,
                      { cost_plan_activity_id: activity.id },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                      }
                    ).then(() => {
                      console.log(`  ✓ Successfully linked item ${item.id} to activity ${activity.id}`);
                      return null;
                    }).catch(err => {
                      console.warn(`  ✗ Failed to link item ${item.id} to activity ${activity.id}:`, err);
                      return null;
                    });
                  }
                  return Promise.resolve(null);
                });
              
              // Wait for all item updates to complete (ignore failures)
              await Promise.all(updatePromises);
              console.log(`✓ Completed linking process`);
            } else {
              console.log('No items or activities to link');
            }
          }
        } catch (linkError) {
          // If linking fails, log but don't fail the save - data is still saved
          console.warn('⚠ Failed to link items to activities, but cost plan was saved:', linkError);
        }
        
        console.log('\n=== SAVE COMPLETED SUCCESSFULLY ===');
        console.log('Cost Plan ID:', savedCostPlan.id);
        console.log('Navigating to view page in 1.5 seconds...');
        
        setSnackbar({
          open: true,
          message: 'Cost Annualised Plan saved successfully! You can now view it in the reports section.',
          severity: 'success'
        });

        // Navigate back after a short delay to show success message
        // Force a page reload to ensure the new data is visible
        setTimeout(() => {
          console.log(`Redirecting to: /implementation-module/${id}/costed-annualized-plan`);
          // Use window.location to force a full page reload to refresh data
          window.location.href = `/implementation-module/${id}/costed-annualized-plan`;
        }, 1500);
      } else {
        console.error('✗ Invalid response from server - no ID in response');
        console.error('Response:', response);
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('\n=== ERROR SAVING COST PLAN ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      // Check for token expiration
      if (error.response?.status === 401) {
        const errorData = error.response.data;
        if (errorData?.msg === 'Token has expired' || errorData?.message === 'Token has expired') {
          setSnackbar({
            open: true,
            message: 'Your session has expired. Please log in again and try saving.',
            severity: 'error'
          });
          // Optionally redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          setLoading(false);
          return;
        }
      }
      
      // Use the error message from the error object if it's already formatted
      // Otherwise, extract from response
      let errorMessage = error.message || 'Failed to save Cost Annualised Plan. Please try again.';
      
      if (!error.message && error.response) {
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.msg) {
          errorMessage = error.response.data.msg;
        } else if (error.response.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        }
      }
      
      // If it's still a generic message and we have a 404, provide more context
      if (errorMessage === 'Failed to save Cost Annualised Plan. Please try again.' && 
          error.response?.status === 404) {
        errorMessage = `Unable to save. Project detail (ID: ${id}) may not exist or you may not have access. ` +
                      `Please verify the project exists and you have the necessary permissions.`;
      }
      
      // Handle 401 errors more generally
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again and try saving.';
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    history.push(`/implementation-module/${id}/costed-annualized-plan`);
  };

  // Prevent body/page scrolling - only allow form area to scroll
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Ref for the scrollable form container
  const formScrollRef = React.useRef(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: 4, pb: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', flex: 1 }}>
        {/* Header - Sticky */}
        <Box 
          sx={{ 
            mb: 3,
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'white',
            pt: 1.5,
            pb: 1.5,
            borderBottom: '1px solid #e0e0e0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <IconButton 
              onClick={() => history.push(`/implementation-module/${id}/costed-annualized-plan`)}
              sx={{ 
                backgroundColor: '#f5f5f5',
                '&:hover': { backgroundColor: '#e0e0e0' },
                flexShrink: 0
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Chip 
              label="Costed Annualized Plan"
              size="small"
              sx={{ 
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 600,
                flexShrink: 0
              }}
            />
            <Chip 
              label={`Project Code: ${projectData.code}`} 
              color="primary" 
              variant="outlined"
              sx={{ fontWeight: 'bold', flexShrink: 0 }}
            />
            {projectData.title && projectData.title !== 'Loading...' ? (
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50', flex: '1 1 auto', minWidth: 0 }}>
                {projectData.title}
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50', flex: '1 1 auto', minWidth: 0 }}>
                Cost Annualised Plan
              </Typography>
            )}
          </Box>
        </Box>

        {/* Form - Scrollable */}
        <Box ref={formScrollRef} sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
        <Paper elevation={3} sx={{ p: 4, pb: 6, '& input, & .MuiOutlinedInput-root': { border: 'none', outline: 'none' }, overflowY: 'visible', maxHeight: 'none' }}>
          <form onSubmit={handleSubmit} noValidate>
            {activities.map((activity, index) => (
              <Box 
                key={index} 
                data-activity-box={index}
                sx={{ mb: 4, pb: 3, borderBottom: index < activities.length - 1 ? '1px solid #e0e0e0' : 'none' }}
              >
                {activities.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      Activity {index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => removeActivity(index)}
                      color="error"
                      size="small"
                      sx={{ 
                        backgroundColor: '#ffebee',
                        '&:hover': { backgroundColor: '#ffcdd2' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                <Grid container spacing={3}>
                  {/* Activity Name */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Activity Name"
                      placeholder="Activity Name *"
                      value={activity.activityName}
                      onChange={(e) => updateActivity(index, 'activityName', e.target.value)}
                      error={!!errors[`activityName_${index}`]}
                      helperText={errors[`activityName_${index}`]}
                      inputProps={{
                        'data-activity-index': index,
                        'data-field': 'activityName'
                      }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: 'none !important',
                      outline: 'none !important',
                      boxShadow: 'none',
                      '& fieldset': {
                        borderWidth: '1px',
                        border: '1px solid rgba(0, 0, 0, 0.23) !important',
                      },
                      '&:hover fieldset': {
                        borderWidth: '1px',
                        border: '1px solid rgba(0, 0, 0, 0.87) !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: '1px',
                        border: '2px solid #1976d2 !important',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      zIndex: 1,
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                    '& input': {
                      border: 'none !important',
                      outline: 'none !important',
                      boxShadow: 'none',
                    },
                  }}
                />
              </Grid>

                  {/* Start Date and End Date */}
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start date *"
                      value={activity.startDate}
                      onChange={(newValue) => updateActivity(index, 'startDate', newValue)}
                      renderInput={(params) => {
                        const hasError = !!errors[`startDate_${index}`];
                        // Merge our custom sx styles with any existing sx styles from params
                        const mergedSx = {
                          ...params.sx,
                          '& .MuiOutlinedInput-root': {
                            border: 'none !important',
                            outline: 'none !important',
                            boxShadow: 'none',
                            '& fieldset': {
                              borderWidth: '1px',
                              border: hasError ? '1px solid #d32f2f !important' : '1px solid rgba(0, 0, 0, 0.23) !important',
                            },
                            '&:hover fieldset': {
                              borderWidth: '1px',
                              border: hasError ? '1px solid #d32f2f !important' : '1px solid rgba(0, 0, 0, 0.87) !important',
                            },
                            '&.Mui-focused fieldset': {
                              borderWidth: '1px',
                              border: hasError ? '2px solid #d32f2f !important' : '2px solid #1976d2 !important',
                            },
                            '&.Mui-error fieldset': {
                              borderColor: '#d32f2f !important',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            zIndex: 1,
                            backgroundColor: 'white',
                            padding: '0 4px',
                            '&.Mui-error': {
                              color: '#d32f2f',
                            },
                          },
                          '& input': {
                            border: 'none !important',
                            outline: 'none !important',
                            boxShadow: 'none',
                          },
                        };
                        return (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={hasError}
                            helperText={errors[`startDate_${index}`]}
                            variant="outlined"
                            placeholder="Start date *"
                            inputProps={{
                              'data-activity-index': index,
                              'data-field': 'startDate'
                            }}
                            sx={mergedSx}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End date *"
                      value={activity.endDate}
                      onChange={(newValue) => updateActivity(index, 'endDate', newValue)}
                      minDate={activity.startDate}
                  renderInput={(params) => {
                    const hasError = !!errors[`endDate_${index}`];
                    // Merge our custom sx styles with any existing sx styles from params
                    const mergedSx = {
                      ...params.sx,
                      '& .MuiOutlinedInput-root': {
                        border: 'none !important',
                        outline: 'none !important',
                        boxShadow: 'none',
                        '& fieldset': {
                          borderWidth: '1px',
                          border: hasError ? '1px solid #d32f2f !important' : '1px solid rgba(0, 0, 0, 0.23) !important',
                        },
                        '&:hover fieldset': {
                          borderWidth: '1px',
                          border: hasError ? '1px solid #d32f2f !important' : '1px solid rgba(0, 0, 0, 0.87) !important',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: '1px',
                          border: hasError ? '2px solid #d32f2f !important' : '2px solid #1976d2 !important',
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#d32f2f !important',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        zIndex: 1,
                        backgroundColor: 'white',
                        padding: '0 4px',
                        '&.Mui-error': {
                          color: '#d32f2f',
                        },
                      },
                      '& input': {
                        border: 'none !important',
                        outline: 'none !important',
                        boxShadow: 'none',
                      },
                    };
                    return (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        error={hasError}
                        helperText={errors[`endDate_${index}`]}
                        variant="outlined"
                        placeholder="End date *"
                        inputProps={{
                          'data-activity-index': index,
                          'data-field': 'endDate'
                        }}
                        sx={mergedSx}
                      />
                    );
                  }}
                />
              </Grid>

                  {/* Activity Outputs - Multi Select with Search */}
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      options={activityOutputsOptions}
                      value={activity.activityOutputs || []}
                      onChange={(event, newValue) => {
                        // Ensure we have a valid array
                        const uniqueValue = newValue && Array.isArray(newValue) ? [...new Set(newValue)] : [];
                        updateActivity(index, 'activityOutputs', uniqueValue);
                      }}
                      disabled={loadingActivityOutputs}
                      loading={loadingActivityOutputs}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Activity Outputs"
                          required={false}
                          error={!!errors[`activityOutputs_${index}`]}
                          helperText={errors[`activityOutputs_${index}`] || (loadingActivityOutputs ? 'Loading activity outputs from PBS API...' : '')}
                          inputProps={{
                            ...params.inputProps,
                            'data-activity-index': index,
                            'data-field': 'activityOutputs',
                            required: false
                          }}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: 'none !important',
                          outline: 'none !important',
                          boxShadow: 'none',
                          '& fieldset': {
                            borderWidth: '1px',
                            border: '1px solid rgba(0, 0, 0, 0.23) !important',
                          },
                          '&:hover fieldset': {
                            borderWidth: '1px',
                            border: '1px solid rgba(0, 0, 0, 0.87) !important',
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '1px',
                            border: '2px solid #1976d2 !important',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          zIndex: 1,
                          backgroundColor: 'white',
                          padding: '0 4px',
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          onDelete={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newValue = activity.activityOutputs.filter((item) => item !== option);
                            updateActivity(index, 'activityOutputs', newValue);
                          }}
                          deleteIcon={<CancelIcon />}
                          sx={{ 
                            fontSize: '0.875rem',
                            '& .MuiChip-deleteIcon': {
                              cursor: 'pointer',
                              fontSize: '1rem',
                              '&:hover': {
                                color: '#d32f2f'
                              }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  renderOption={(props, option) => (
                    <MenuItem
                      {...props}
                      sx={{
                        fontSize: '0.875rem',
                        padding: '8px 16px',
                      }}
                    >
                      {option}
                    </MenuItem>
                  )}
                  ListboxProps={{
                    sx: {
                      maxHeight: '300px',
                      '& .MuiAutocomplete-option': {
                        fontSize: '0.875rem',
                        padding: '8px 16px',
                      },
                    },
                  }}
                  noOptionsText={loadingActivityOutputs ? 'Loading...' : 'No activity outputs available'}
                />
              </Grid>

                  {/* Activity Description - Text Area */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Activity Description"
                      placeholder="Activity Description *"
                      value={activity.activityDescription}
                      onChange={(e) => updateActivity(index, 'activityDescription', e.target.value)}
                      error={!!errors[`activityDescription_${index}`]}
                      helperText={errors[`activityDescription_${index}`]}
                      variant="outlined"
                      multiline
                      minRows={2}
                      maxRows={3}
                      inputProps={{
                        'data-activity-index': index,
                        'data-field': 'activityDescription'
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          border: 'none !important',
                          outline: 'none !important',
                          boxShadow: 'none',
                          '& fieldset': {
                            borderWidth: '1px',
                            border: '1px solid rgba(0, 0, 0, 0.23) !important',
                          },
                          '&:hover fieldset': {
                            borderWidth: '1px',
                            border: '1px solid rgba(0, 0, 0, 0.87) !important',
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '1px',
                            border: '2px solid #1976d2 !important',
                          },
                          '& textarea': {
                            minHeight: '56px !important',
                            maxHeight: '96px !important',
                            padding: '8px 14px !important',
                            lineHeight: '1.4',
                            overflowY: 'auto',
                          },
                        },
                        '& input, & textarea': {
                          border: 'none !important',
                          outline: 'none !important',
                          boxShadow: 'none',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                
                {/* Add Activity Button */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      // Validate current activity before adding new one
                      const activityErrors = validateSingleActivity(activity, index);
                      if (Object.keys(activityErrors).length > 0) {
                        setErrors(prevErrors => ({
                          ...prevErrors,
                          ...activityErrors
                        }));
                        // Scroll to first error
                        setTimeout(() => {
                          const firstErrorField = Object.keys(activityErrors)[0];
                          const fieldId = firstErrorField.split('_')[0];
                          const errorIndex = firstErrorField.split('_')[1];
                          const element = document.querySelector(`[data-activity-index="${errorIndex}"][data-field="${fieldId}"]`);
                          const scrollContainer = formScrollRef.current;
                          if (element && scrollContainer) {
                            const containerRect = scrollContainer.getBoundingClientRect();
                            const elementRect = element.getBoundingClientRect();
                            const scrollTop = scrollContainer.scrollTop;
                            const elementTop = elementRect.top - containerRect.top + scrollTop;
                            scrollContainer.scrollTo({
                              top: elementTop - (containerRect.height / 2) + (elementRect.height / 2),
                              behavior: 'smooth'
                            });
                          }
                        }, 100);
                        return;
                      }
                      
                      // Clear errors for this activity
                      const newErrors = { ...errors };
                      Object.keys(newErrors).forEach(key => {
                        if (key.endsWith(`_${index}`)) {
                          delete newErrors[key];
                        }
                      });
                      setErrors(newErrors);
                      
                      // Add new activity
                      const newActivityIndex = activities.length;
                      setActivities([...activities, {
                        activityName: '',
                        startDate: null,
                        endDate: null,
                        activityOutputs: [],
                        activityDescription: '',
                        costPlanActivity: '',
                        fund: '',
                        fundSource: '',
                        costCategory: '',
                        costClassification: '',
                        procurementMethod: '',
                        procurementStartDate: null,
                        contractSignDate: null,
                        procurementDetails: '',
                        amount: ''
                      }]);
                      
                      // Scroll to new activity
                      setTimeout(() => {
                        const newActivityElement = document.querySelector(`[data-activity-box="${newActivityIndex}"]`);
                        const scrollContainer = formScrollRef.current;
                        if (newActivityElement && scrollContainer) {
                          const containerRect = scrollContainer.getBoundingClientRect();
                          const elementRect = newActivityElement.getBoundingClientRect();
                          const scrollTop = scrollContainer.scrollTop;
                          const elementTop = elementRect.top - containerRect.top + scrollTop;
                          const buttonsContainer = document.querySelector('[data-buttons-container]');
                          const buttonsHeight = buttonsContainer ? buttonsContainer.offsetHeight : 80;
                          const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                          const desiredScrollTop = elementTop - 100;
                          const finalScrollTop = Math.min(desiredScrollTop, maxScrollTop - buttonsHeight - 20);
                          scrollContainer.scrollTo({
                            top: Math.max(0, finalScrollTop),
                            behavior: 'smooth'
                          });
                          setTimeout(() => {
                            const firstInput = newActivityElement.querySelector('input[type="text"]');
                            if (firstInput) {
                              firstInput.focus();
                            }
                          }, 500);
                        }
                      }, 150);
                    }}
                    sx={{
                      backgroundColor: '#3F51B5',
                      color: 'white',
                      fontWeight: 'normal',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        backgroundColor: '#303F9F',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    Add Activity
                  </Button>
                </Box>
              </Box>
            ))}

            {/* Cost Details Section - Show after all activities */}
            {activities.filter(act => act.activityName && act.activityName.trim() !== '').length > 0 && (
              <Box sx={{ mt: 5, pt: 4, borderTop: '3px solid #e0e0e0' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Add Cost Details
                </Typography>
                
                {activities
                  .map((activity, index) => {
                    if (!activity.activityName || activity.activityName.trim() === '') return null;
                    
                    return (
                      <Box key={`cost-${index}`} sx={{ mb: 4, pb: 3, borderBottom: index < activities.filter(act => act.activityName && act.activityName.trim() !== '').length - 1 ? '2px solid #e0e0e0' : 'none' }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1976d2' }}>
                            Activity: {activity.activityName}
                          </Typography>
                        </Box>
                        
                        <Grid container spacing={3}>
                          {/* Cost Plan Activity - Auto-populated */}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              required
                              label="Cost Plan Activity"
                              value={activity.activityName}
                              disabled
                              variant="outlined"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderWidth: '1px',
                                    border: '1px solid rgba(0, 0, 0, 0.23) !important',
                                  },
                                },
                              }}
                            />
                          </Grid>
                          
                          {/* Fund */}
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              options={fundOptions}
                              value={activity.fund || null}
                              onChange={(event, newValue) => updateActivity(index, 'fund', newValue || '')}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Fund *"
                                  required
                                  error={!!errors[`fund_${index}`]}
                                  helperText={errors[`fund_${index}`]}
                                  variant="outlined"
                                />
                              )}
                              renderOption={(props, option) => (
                                <MenuItem
                                  {...props}
                                  sx={{
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: '300px',
                                  '& .MuiAutocomplete-option': {
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  },
                                },
                              }}
                              noOptionsText="No options available"
                            />
                          </Grid>
                          
                          {/* Fund Source */}
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              options={getFundSourceOptions(activity.fund)}
                              value={activity.fundSource || null}
                              onChange={(event, newValue) => {
                                updateActivity(index, 'fundSource', newValue || '');
                              }}
                              disabled={!activity.fund}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Fund Source *"
                                  required
                                  error={!!errors[`fundSource_${index}`]}
                                  helperText={errors[`fundSource_${index}`] || (!activity.fund ? 'Please select a Fund first' : '')}
                                  variant="outlined"
                                />
                              )}
                              renderOption={(props, option) => (
                                <MenuItem
                                  {...props}
                                  sx={{
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: '300px',
                                  '& .MuiAutocomplete-option': {
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  },
                                },
                              }}
                              noOptionsText="No options available"
                            />
                          </Grid>
                          
                          {/* Cost Category */}
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              options={costCategoryOptions}
                              value={activity.costCategory || null}
                              onChange={(event, newValue) => updateActivity(index, 'costCategory', newValue || '')}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Cost Category *"
                                  required
                                  error={!!errors[`costCategory_${index}`]}
                                  helperText={errors[`costCategory_${index}`]}
                                  variant="outlined"
                                />
                              )}
                              renderOption={(props, option) => (
                                <MenuItem
                                  {...props}
                                  sx={{
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: '300px',
                                  '& .MuiAutocomplete-option': {
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  },
                                },
                              }}
                              noOptionsText="No options available"
                            />
                          </Grid>
                          
                          {/* Cost Classification */}
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              options={getCostClassificationOptions(activity.costCategory)}
                              value={activity.costClassification || null}
                              onChange={(event, newValue) => updateActivity(index, 'costClassification', newValue || '')}
                              disabled={!activity.costCategory}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Cost Classification *"
                                  required
                                  error={!!errors[`costClassification_${index}`]}
                                  helperText={errors[`costClassification_${index}`] || (!activity.costCategory ? 'Please select a Cost Category first' : '')}
                                  variant="outlined"
                                />
                              )}
                              renderOption={(props, option) => (
                                <MenuItem
                                  {...props}
                                  sx={{
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: '300px',
                                  '& .MuiAutocomplete-option': {
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  },
                                },
                              }}
                              noOptionsText="No options available"
                            />
                          </Grid>
                          
                          {/* Procurement Method */}
                          <Grid item xs={12} sm={6}>
                            <Autocomplete
                              options={procurementMethodOptions}
                              value={activity.procurementMethod || null}
                              onChange={(event, newValue) => updateActivity(index, 'procurementMethod', newValue || '')}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Procurement Method *"
                                  required
                                  error={!!errors[`procurementMethod_${index}`]}
                                  helperText={errors[`procurementMethod_${index}`]}
                                  variant="outlined"
                                />
                              )}
                              renderOption={(props, option) => (
                                <MenuItem
                                  {...props}
                                  sx={{
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: '300px',
                                  '& .MuiAutocomplete-option': {
                                    fontSize: '0.875rem',
                                    padding: '8px 16px',
                                  },
                                },
                              }}
                              noOptionsText="No options available"
                            />
                          </Grid>
                          
                          {/* Procurement Start Date */}
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              label="Procurement Start Date *"
                              value={activity.procurementStartDate}
                              onChange={(newValue) => updateActivity(index, 'procurementStartDate', newValue)}
                              renderInput={(params) => {
                                const hasError = !!errors[`procurementStartDate_${index}`];
                                return (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    required
                                    error={hasError}
                                    helperText={errors[`procurementStartDate_${index}`]}
                                    variant="outlined"
                                    placeholder="dd/mm/yyyy"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                          borderWidth: '1px',
                                          border: hasError ? '1px solid #d32f2f !important' : '1px solid rgba(0, 0, 0, 0.23) !important',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderWidth: '1px',
                                          border: hasError ? '2px solid #d32f2f !important' : '2px solid #1976d2 !important',
                                        },
                                      },
                                    }}
                                  />
                                );
                              }}
                            />
                          </Grid>
                          
                          {/* Contract Sign Date */}
                          <Grid item xs={12} sm={6}>
                            <DatePicker
                              label="Contract Sign Date *"
                              value={activity.contractSignDate}
                              onChange={(newValue) => updateActivity(index, 'contractSignDate', newValue)}
                              minDate={activity.procurementStartDate}
                              renderInput={(params) => {
                                const hasError = !!errors[`contractSignDate_${index}`];
                                return (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    required
                                    error={hasError}
                                    helperText={errors[`contractSignDate_${index}`]}
                                    variant="outlined"
                                    placeholder="dd/mm/yyyy"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                          borderWidth: '1px',
                                          border: hasError ? '1px solid #d32f2f !important' : '1px solid rgba(0, 0, 0, 0.23) !important',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderWidth: '1px',
                                          border: hasError ? '2px solid #d32f2f !important' : '2px solid #1976d2 !important',
                                        },
                                      },
                                    }}
                                  />
                                );
                              }}
                            />
                          </Grid>
                          
                          {/* Procurement Details */}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              required
                              label="Procurement Details"
                              placeholder="Procurement Details *"
                              value={activity.procurementDetails}
                              onChange={(e) => updateActivity(index, 'procurementDetails', e.target.value)}
                              error={!!errors[`procurementDetails_${index}`]}
                              helperText={errors[`procurementDetails_${index}`]}
                              variant="outlined"
                              multiline
                              minRows={2}
                              maxRows={3}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  border: 'none !important',
                                  outline: 'none !important',
                                  boxShadow: 'none',
                                  '& fieldset': {
                                    borderWidth: '1px',
                                    border: '1px solid rgba(0, 0, 0, 0.23) !important',
                                  },
                                  '&:hover fieldset': {
                                    borderWidth: '1px',
                                    border: '1px solid rgba(0, 0, 0, 0.87) !important',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderWidth: '1px',
                                    border: '2px solid #1976d2 !important',
                                  },
                                  '& textarea': {
                                    minHeight: '56px !important',
                                    maxHeight: '96px !important',
                                    padding: '8px 14px !important',
                                    lineHeight: '1.4',
                                    overflowY: 'auto',
                                  },
                                },
                                '& input, & textarea': {
                                  border: 'none !important',
                                  outline: 'none !important',
                                  boxShadow: 'none',
                                },
                              }}
                            />
                          </Grid>
                          
                          {/* Amount */}
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              label="Amount"
                              placeholder="Amount *"
                              value={activity.amount}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9.]/g, '');
                                updateActivity(index, 'amount', value);
                              }}
                              error={!!errors[`amount_${index}`]}
                              helperText={errors[`amount_${index}`]}
                              variant="outlined"
                              type="text"
                              inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9.]*'
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderWidth: '1px',
                                    border: '1px solid rgba(0, 0, 0, 0.23) !important',
                                  },
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                        
                        {/* Add Cost Button */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              // Cost details are automatically saved to the activity
                              // This button could be used for validation or adding multiple cost entries
                            }}
                            sx={{
                              backgroundColor: '#3F51B5',
                              color: 'white',
                              fontWeight: 'normal',
                              textTransform: 'uppercase',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              px: 3,
                              py: 1,
                              '&:hover': {
                                backgroundColor: '#303F9F',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                              }
                            }}
                          >
                            Add Cost
                          </Button>
                        </Box>
                      </Box>
                    );
                  })
                  .filter(item => item !== null)}
              </Box>
            )}

            {/* Action Buttons */}
            <Box data-buttons-container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 1, mb: 2, pt: 2, pb: 2, borderTop: '1px solid #e0e0e0' }}>
              {/* <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addActivity}
                sx={{
                  backgroundColor: '#3F51B5',
                  color: 'white',
                  fontWeight: 'normal',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#303F9F',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  }
                }}
              >
                Add Activity
              </Button> */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    borderColor: '#3F51B5',
                    color: '#3F51B5',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    '&:hover': {
                      borderColor: '#303F9F',
                      backgroundColor: 'rgba(63, 81, 181, 0.04)',
                    },
                    '&:disabled': {
                      borderColor: '#BDBDBD',
                      color: '#BDBDBD',
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    backgroundColor: '#3F51B5',
                    color: 'white',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: '#303F9F',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    },
                    '&:disabled': {
                      backgroundColor: '#BDBDBD',
                      color: 'white',
                    }
                  }}
                >
                  {loading ? 'Submitting...' : 'Save & Exit'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
        </Box>
      </Container>
      </Box>
      
      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default CostAnnualisedPlanForm;

