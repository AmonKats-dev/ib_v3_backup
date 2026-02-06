// Chart of Accounts - Uganda Government CoA Structure
export const chartOfAccounts = {
  recurrent: {
    name: 'Recurrent Expenditure',
    codes: [
      { code: '211', name: 'Wages and Salaries', description: 'Personnel emoluments' },
      { code: '212', name: 'Social Contributions', description: 'NSSF, gratuity, pension' },
      { code: '213', name: 'Allowances', description: 'Travel, subsistence, overtime' },
      { code: '221', name: 'Utilities', description: 'Electricity, water, telecommunications' },
      { code: '222', name: 'Fuel and Lubricants', description: 'Vehicle and generator fuel' },
      { code: '223', name: 'Maintenance', description: 'Repairs and maintenance' },
      { code: '224', name: 'Office Supplies', description: 'Stationery and consumables' },
      { code: '225', name: 'Professional Services', description: 'Consultancy, legal, audit fees' },
      { code: '226', name: 'Training', description: 'Capacity building and training' },
      { code: '227', name: 'Rentals', description: 'Property and equipment rentals' },
      { code: '228', name: 'Other Operating Expenses', description: 'Miscellaneous operational costs' }
    ]
  },
  development: {
    name: 'Development Expenditure',
    codes: [
      { code: '311', name: 'Land and Buildings', description: 'Land acquisition and structures' },
      { code: '312', name: 'Transport Equipment', description: 'Vehicles and transport assets' },
      { code: '313', name: 'Plant and Machinery', description: 'Equipment and machinery' },
      { code: '314', name: 'Furniture and Fixtures', description: 'Office furniture and fittings' },
      { code: '315', name: 'ICT Equipment', description: 'Computers, servers, network equipment' },
      { code: '316', name: 'Specialized Equipment', description: 'Sector-specific equipment' },
      { code: '321', name: 'Civil Works', description: 'Construction and infrastructure' },
      { code: '322', name: 'Rehabilitation', description: 'Asset rehabilitation and upgrading' },
      { code: '331', name: 'Software', description: 'Computer software and licenses' },
      { code: '332', name: 'Patents and Rights', description: 'Intellectual property' }
    ]
  },
  transfers: {
    name: 'Transfers and Subsidies',
    codes: [
      { code: '411', name: 'Grants to Local Governments', description: 'LG transfers' },
      { code: '412', name: 'Grants to Public Institutions', description: 'Institutional grants' },
      { code: '413', name: 'Subsidies', description: 'Subsidies to entities' },
      { code: '414', name: 'Social Benefits', description: 'Welfare payments' }
    ]
  },
  arrears: {
    name: 'Arrears Clearance',
    codes: [
      { code: '511', name: 'Domestic Arrears', description: 'Local supplier arrears' },
      { code: '512', name: 'Pension Arrears', description: 'Outstanding pension obligations' },
      { code: '513', name: 'Other Arrears', description: 'Miscellaneous arrears' }
    ]
  }
};

// PBS (Programme Budget System) Common Activities
export const pbsActivities = [
  'Policy and planning',
  'Monitoring and evaluation',
  'Research and development',
  'Capacity building',
  'Infrastructure development',
  'Service delivery',
  'Regulatory compliance',
  'Quality assurance',
  'Community mobilization',
  'Procurement and contract management',
  'Financial management',
  'Human resource management',
  'ICT systems development',
  'Stakeholder engagement',
  'Environmental management'
];

// Generate fiscal years
export const generateFiscalYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    years.push({
      value: year,
      label: `FY ${year}/${year + 1}`
    });
  }
  
  return years;
};
