export const projectsMockData = [
  {
    id: 1,
    name: 'Dallas Data Center - Phase 1',
    location: 'Dallas, TX',
    status: 'In Progress',
    statusType: 'progress',
    progress: 65,
    targetMW: 50,
    sqft: 125000,
    startDate: '2024-01-15',
    estimatedCompletion: '2025-06-30',
    phase: 'Construction',
    currentStage: 'procurement',
    initialSurveys: {
      items: [
        { id: 1, name: 'Site Feasibility Study.pdf', type: 'pdf', uploadedDate: '2024-01-20', size: '2.4 MB', status: 'completed' },
        { id: 2, name: 'Environmental Impact Assessment.pdf', type: 'pdf', uploadedDate: '2024-01-25', size: '5.1 MB', status: 'completed' },
        { id: 3, name: 'Geotechnical Survey Report.pdf', type: 'pdf', uploadedDate: '2024-02-01', size: '3.8 MB', status: 'completed' },
        { id: 4, name: 'Utility Infrastructure Assessment.xlsx', type: 'excel', uploadedDate: '2024-02-05', size: '890 KB', status: 'completed' },
      ]
    },
    reports: {
      items: [
        { id: 1, name: 'Structural Engineering Report.pdf', type: 'pdf', uploadedDate: '2024-03-10', size: '4.2 MB', status: 'completed' },
        { id: 2, name: 'Electrical Systems Design.pdf', type: 'pdf', uploadedDate: '2024-03-15', size: '6.7 MB', status: 'completed' },
        { id: 3, name: 'HVAC and Cooling Analysis.pdf', type: 'pdf', uploadedDate: '2024-03-20', size: '3.5 MB', status: 'completed' },
        { id: 4, name: 'Fire Safety Compliance Report.pdf', type: 'pdf', uploadedDate: '2024-04-01', size: '2.1 MB', status: 'completed' },
        { id: 5, name: 'Network Infrastructure Design.pdf', type: 'pdf', uploadedDate: '2024-04-10', size: '5.3 MB', status: 'completed' },
      ]
    },
    financialModel: {
      totalBudget: 125000000,
      spent: 45000000,
      projected: 80000000,
      items: [
        { id: 1, name: 'Project Budget Model v3.2.xlsx', type: 'excel', uploadedDate: '2024-05-01', size: '1.2 MB', status: 'active' },
        { id: 2, name: 'Cash Flow Projections Q2.xlsx', type: 'excel', uploadedDate: '2024-05-15', size: '890 KB', status: 'active' },
        { id: 3, name: 'ROI Analysis.pdf', type: 'pdf', uploadedDate: '2024-05-20', size: '2.5 MB', status: 'completed' },
        { id: 4, name: 'Funding Agreement - Primary.pdf', type: 'pdf', uploadedDate: '2024-02-10', size: '1.8 MB', status: 'completed' },
      ]
    },
    procurement: {
      servers: [
        { id: 1, vendor: 'Dell EMC', model: 'PowerEdge R750', quantity: 120, unitPrice: 8500, totalPrice: 1020000, status: 'ordered', expectedDelivery: '2024-09-15' },
        { id: 2, vendor: 'HPE', model: 'ProLiant DL380 Gen11', quantity: 80, unitPrice: 9200, totalPrice: 736000, status: 'ordered', expectedDelivery: '2024-09-20' },
        { id: 3, vendor: 'Supermicro', model: 'SYS-2029U', quantity: 50, unitPrice: 7800, totalPrice: 390000, status: 'quote', expectedDelivery: '2024-10-01' },
      ],
      gpus: [
        { id: 1, vendor: 'NVIDIA', model: 'H100 80GB', quantity: 200, unitPrice: 32000, totalPrice: 6400000, status: 'ordered', expectedDelivery: '2024-11-01' },
        { id: 2, vendor: 'NVIDIA', model: 'A100 40GB', quantity: 150, unitPrice: 15000, totalPrice: 2250000, status: 'ordered', expectedDelivery: '2024-10-15' },
      ],
      cooling: [
        { id: 1, vendor: 'Schneider Electric', model: 'InRow Cooling DX', quantity: 15, unitPrice: 45000, totalPrice: 675000, status: 'delivered', expectedDelivery: '2024-07-01' },
        { id: 2, vendor: 'Vertiv', model: 'Liebert DSE', quantity: 10, unitPrice: 52000, totalPrice: 520000, status: 'in-transit', expectedDelivery: '2024-08-15' },
      ],
      displays: [
        { id: 1, vendor: 'Samsung', model: 'QM85R-B', quantity: 12, unitPrice: 4500, totalPrice: 54000, status: 'delivered', expectedDelivery: '2024-06-20' },
        { id: 2, vendor: 'LG', model: 'UH5F-B Series', quantity: 8, unitPrice: 3200, totalPrice: 25600, status: 'delivered', expectedDelivery: '2024-06-25' },
      ]
    },
    documents: {
      items: [
        { id: 1, name: 'Development Agreement - City of Dallas.pdf', type: 'pdf', uploadedDate: '2024-01-10', size: '3.2 MB', status: 'executed', expiryDate: '2029-01-10' },
        { id: 2, name: 'Master Construction Contract.pdf', type: 'pdf', uploadedDate: '2024-02-15', size: '5.8 MB', status: 'executed', expiryDate: '2025-12-31' },
        { id: 3, name: 'Power Purchase Agreement.pdf', type: 'pdf', uploadedDate: '2024-03-01', size: '2.7 MB', status: 'executed', expiryDate: '2034-03-01' },
        { id: 4, name: 'Equipment Lease Agreement.pdf', type: 'pdf', uploadedDate: '2024-04-10', size: '1.9 MB', status: 'executed', expiryDate: '2027-04-10' },
        { id: 5, name: 'Insurance Policy - Construction.pdf', type: 'pdf', uploadedDate: '2024-02-20', size: '1.2 MB', status: 'active', expiryDate: '2025-02-20' },
      ]
    },
    taxIncentives: {
      totalIncentives: 8500000,
      items: [
        { id: 1, name: 'Texas Chapter 313 Application.pdf', type: 'pdf', uploadedDate: '2024-01-30', size: '2.1 MB', status: 'approved', estimatedValue: 5000000 },
        { id: 2, name: 'Economic Development Grant - Dallas.pdf', type: 'pdf', uploadedDate: '2024-02-10', size: '1.5 MB', status: 'approved', estimatedValue: 2000000 },
        { id: 3, name: 'Energy Efficiency Tax Credit Application.pdf', type: 'pdf', uploadedDate: '2024-03-15', size: '980 KB', status: 'pending', estimatedValue: 1500000 },
        { id: 4, name: 'Job Creation Incentive Agreement.pdf', type: 'pdf', uploadedDate: '2024-04-01', size: '1.2 MB', status: 'under-review', estimatedValue: 0 },
      ]
    }
  },
  {
    id: 2,
    name: 'Phoenix DC Campus',
    location: 'Phoenix, AZ',
    status: 'Planning',
    statusType: 'planning',
    progress: 25,
    targetMW: 100,
    sqft: 250000,
    startDate: '2024-06-01',
    estimatedCompletion: '2026-03-15',
    phase: 'Land Acquisition',
    currentStage: 'initial-surveys',
    initialSurveys: {
      items: [
        { id: 1, name: 'Site Selection Analysis.pdf', type: 'pdf', uploadedDate: '2024-06-10', size: '3.1 MB', status: 'completed' },
        { id: 2, name: 'Preliminary Environmental Study.pdf', type: 'pdf', uploadedDate: '2024-06-20', size: '4.5 MB', status: 'in-progress' },
        { id: 3, name: 'Water Availability Assessment.pdf', type: 'pdf', uploadedDate: '2024-07-01', size: '2.2 MB', status: 'in-progress' },
      ]
    },
    reports: {
      items: [
        { id: 1, name: 'Preliminary Site Assessment.pdf', type: 'pdf', uploadedDate: '2024-07-10', size: '2.8 MB', status: 'draft' },
      ]
    },
    financialModel: {
      totalBudget: 250000000,
      spent: 5000000,
      projected: 245000000,
      items: [
        { id: 1, name: 'Preliminary Budget Estimate.xlsx', type: 'excel', uploadedDate: '2024-06-15', size: '1.1 MB', status: 'draft' },
        { id: 2, name: 'Land Acquisition Costs.xlsx', type: 'excel', uploadedDate: '2024-06-25', size: '650 KB', status: 'active' },
      ]
    },
    procurement: {
      servers: [],
      gpus: [],
      cooling: [],
      displays: []
    },
    documents: {
      items: [
        { id: 1, name: 'Letter of Intent - Land Purchase.pdf', type: 'pdf', uploadedDate: '2024-07-15', size: '890 KB', status: 'pending', expiryDate: '2024-10-15' },
        { id: 2, name: 'NDA - City of Phoenix.pdf', type: 'pdf', uploadedDate: '2024-06-05', size: '450 KB', status: 'executed', expiryDate: '2025-06-05' },
      ]
    },
    taxIncentives: {
      totalIncentives: 0,
      items: [
        { id: 1, name: 'Arizona Tax Incentive Pre-Application.pdf', type: 'pdf', uploadedDate: '2024-07-20', size: '1.3 MB', status: 'draft', estimatedValue: 8000000 },
      ]
    }
  },
  {
    id: 3,
    name: 'Austin Edge Computing',
    location: 'Austin, TX',
    status: 'In Progress',
    statusType: 'progress',
    progress: 85,
    targetMW: 25,
    sqft: 62500,
    startDate: '2023-08-10',
    estimatedCompletion: '2025-01-20',
    phase: 'Equipment Installation',
    currentStage: 'procurement',
    initialSurveys: {
      items: [
        { id: 1, name: 'Site Survey Final.pdf', type: 'pdf', uploadedDate: '2023-08-15', size: '2.9 MB', status: 'completed' },
        { id: 2, name: 'Environmental Clearance.pdf', type: 'pdf', uploadedDate: '2023-08-20', size: '1.8 MB', status: 'completed' },
      ]
    },
    reports: {
      items: [
        { id: 1, name: 'Engineering Final Report.pdf', type: 'pdf', uploadedDate: '2023-10-15', size: '7.2 MB', status: 'completed' },
        { id: 2, name: 'Network Design Document.pdf', type: 'pdf', uploadedDate: '2023-11-01', size: '4.1 MB', status: 'completed' },
      ]
    },
    financialModel: {
      totalBudget: 62500000,
      spent: 52000000,
      projected: 10500000,
      items: [
        { id: 1, name: 'Final Budget Model.xlsx', type: 'excel', uploadedDate: '2024-08-01', size: '1.5 MB', status: 'active' },
        { id: 2, name: 'Monthly Financial Report - July.pdf', type: 'pdf', uploadedDate: '2024-08-05', size: '780 KB', status: 'completed' },
      ]
    },
    procurement: {
      servers: [
        { id: 1, vendor: 'Dell EMC', model: 'PowerEdge R650', quantity: 60, unitPrice: 7500, totalPrice: 450000, status: 'delivered', expectedDelivery: '2024-06-01' },
      ],
      gpus: [
        { id: 1, vendor: 'NVIDIA', model: 'A40', quantity: 80, unitPrice: 8000, totalPrice: 640000, status: 'installed', expectedDelivery: '2024-07-01' },
      ],
      cooling: [
        { id: 1, vendor: 'Schneider Electric', model: 'EcoBreeze', quantity: 8, unitPrice: 38000, totalPrice: 304000, status: 'installed', expectedDelivery: '2024-05-15' },
      ],
      displays: [
        { id: 1, vendor: 'Samsung', model: 'QB75R', quantity: 6, unitPrice: 3500, totalPrice: 21000, status: 'installed', expectedDelivery: '2024-06-10' },
      ]
    },
    documents: {
      items: [
        { id: 1, name: 'Construction Contract.pdf', type: 'pdf', uploadedDate: '2023-09-01', size: '4.5 MB', status: 'executed', expiryDate: '2025-03-01' },
        { id: 2, name: 'PPA - Austin Energy.pdf', type: 'pdf', uploadedDate: '2023-09-15', size: '3.1 MB', status: 'executed', expiryDate: '2033-09-15' },
      ]
    },
    taxIncentives: {
      totalIncentives: 3200000,
      items: [
        { id: 1, name: 'Texas Chapter 313 Approval.pdf', type: 'pdf', uploadedDate: '2023-10-01', size: '1.9 MB', status: 'approved', estimatedValue: 3200000 },
      ]
    }
  },
  {
    id: 4,
    name: 'Chicago Metro DC',
    location: 'Chicago, IL',
    status: 'On Hold',
    statusType: 'hold',
    progress: 40,
    targetMW: 75,
    sqft: 187500,
    startDate: '2023-11-01',
    estimatedCompletion: '2025-09-30',
    phase: 'Permitting',
    currentStage: 'reports',
    initialSurveys: {
      items: [
        { id: 1, name: 'Site Feasibility Study.pdf', type: 'pdf', uploadedDate: '2023-11-10', size: '3.3 MB', status: 'completed' },
        { id: 2, name: 'Environmental Assessment.pdf', type: 'pdf', uploadedDate: '2023-11-20', size: '4.7 MB', status: 'completed' },
      ]
    },
    reports: {
      items: [
        { id: 1, name: 'Zoning Compliance Report.pdf', type: 'pdf', uploadedDate: '2024-01-15', size: '2.5 MB', status: 'pending-review' },
        { id: 2, name: 'Traffic Impact Study.pdf', type: 'pdf', uploadedDate: '2024-02-01', size: '3.8 MB', status: 'submitted' },
        { id: 3, name: 'Stormwater Management Plan.pdf', type: 'pdf', uploadedDate: '2024-02-15', size: '2.1 MB', status: 'revision-required' },
      ]
    },
    financialModel: {
      totalBudget: 187500000,
      spent: 15000000,
      projected: 172500000,
      items: [
        { id: 1, name: 'Budget Model v2.1.xlsx', type: 'excel', uploadedDate: '2024-03-01', size: '1.3 MB', status: 'on-hold' },
      ]
    },
    procurement: {
      servers: [],
      gpus: [],
      cooling: [],
      displays: []
    },
    documents: {
      items: [
        { id: 1, name: 'Development Agreement - Draft.pdf', type: 'pdf', uploadedDate: '2024-01-20', size: '2.8 MB', status: 'draft', expiryDate: null },
        { id: 2, name: 'Utility Easement Agreement.pdf', type: 'pdf', uploadedDate: '2024-02-10', size: '1.1 MB', status: 'pending', expiryDate: null },
      ]
    },
    taxIncentives: {
      totalIncentives: 0,
      items: [
        { id: 1, name: 'Illinois EDGE Tax Credit Application.pdf', type: 'pdf', uploadedDate: '2024-03-01', size: '1.7 MB', status: 'on-hold', estimatedValue: 6500000 },
      ]
    }
  }
];

export const getProjectById = (id) => {
  return projectsMockData.find(project => project.id === parseInt(id));
};

export const getFileIcon = (type) => {
  switch (type) {
    case 'pdf':
      return 'FileText';
    case 'excel':
      return 'FileSpreadsheet';
    case 'word':
      return 'FileText';
    default:
      return 'File';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
    case 'approved':
    case 'executed':
    case 'delivered':
    case 'installed':
      return 'bg-green-50 text-green-700';
    case 'in-progress':
    case 'active':
    case 'ordered':
    case 'in-transit':
      return 'bg-blue-50 text-blue-700';
    case 'pending':
    case 'quote':
    case 'under-review':
    case 'pending-review':
      return 'bg-yellow-50 text-yellow-700';
    case 'draft':
    case 'on-hold':
      return 'bg-gray-50 text-gray-700';
    case 'revision-required':
    case 'submitted':
      return 'bg-orange-50 text-orange-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};
