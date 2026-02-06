import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetItemModal from './BudgetItemModal';
import ConfirmationDialog from './ConfirmationDialog';

const Step3 = ({ budgetItems, setBudgetItems, getTotalCommitmentValue, getCommitmentValueForType, nextStep, prevStep, projectData, pbsData, isAllAtOnceMode, allAtOnceBudgetItems, setAllAtOnceBudgetItems, formData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [pbsBudgetData, setPbsBudgetData] = useState([]);
  const [loadingPbsData, setLoadingPbsData] = useState(false);
  const [selectedCommitmentTypeForItem, setSelectedCommitmentTypeForItem] = useState('contractual');

  // Fetch PBS budget data once when Step3 loads
  useEffect(() => {
    if (projectData && pbsData && pbsBudgetData.length === 0) {
      fetchPbsBudgetData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData, pbsData]);

  const fetchPbsBudgetData = async () => {
    if (!projectData || !pbsData) return;
    
    try {
      setLoadingPbsData(true);
      
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

      // Then fetch the PBS budget data for the specific project and vote
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
      
      // Filter data for the specific project and vote
      const filteredData = fetchedData.filter(item => 
        item.Project_Code === projectData.code && 
        item.Vote_Code === pbsData.Vote_Code
      );
      
      setPbsBudgetData(filteredData);
      setLoadingPbsData(false);
    } catch (error) {
      console.error("Error fetching PBS budget data:", error);
      setLoadingPbsData(false);
    }
  };

  const updateBudgetSummary = () => {
    // This will be handled by the parent component
  };

  const addBudgetItem = (item) => {
    if (isAllAtOnceMode) {
      // Add item to the selected commitment type in allAtOnceBudgetItems
      setAllAtOnceBudgetItems(prev => ({
        ...prev,
        [selectedCommitmentTypeForItem]: [...(prev[selectedCommitmentTypeForItem] || []), item]
      }));
    } else {
      setBudgetItems(prev => [...prev, item]);
    }
  };

  const handleDeleteClick = (id, item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (isAllAtOnceMode && itemToDelete.commitmentType) {
        // Delete from allAtOnceBudgetItems
        const type = itemToDelete.commitmentType.toLowerCase();
        setAllAtOnceBudgetItems(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item.id !== itemToDelete.id)
        }));
      } else {
        setBudgetItems(prev => prev.filter(item => item.id !== itemToDelete.id));
      }
      setItemToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getConsolidatedBudgetItems = () => {
    if (!isAllAtOnceMode) {
      return budgetItems;
    }
    
    // Consolidate budget items from all three commitment types
    const consolidated = [];
    if (allAtOnceBudgetItems.contractual) {
      consolidated.push(...allAtOnceBudgetItems.contractual.map(item => ({ ...item, commitmentType: 'Contractual' })));
    }
    if (allAtOnceBudgetItems['non-contractual']) {
      consolidated.push(...allAtOnceBudgetItems['non-contractual'].map(item => ({ ...item, commitmentType: 'Non-Contractual' })));
    }
    if (allAtOnceBudgetItems.counterpart) {
      consolidated.push(...allAtOnceBudgetItems.counterpart.map(item => ({ ...item, commitmentType: 'Counterpart' })));
    }
    
    return consolidated;
  };

  // Calculate totals per commitment type
  const getTotalForType = (type) => {
    if (!isAllAtOnceMode) return 0;
    const items = allAtOnceBudgetItems[type] || [];
    return items.reduce((sum, item) => sum + item.totalCost, 0);
  };

  // Calculate remaining allocation for each type
  const getRemainingForType = (type) => {
    if (!isAllAtOnceMode || !getCommitmentValueForType) return 0;
    const commitmentValue = getCommitmentValueForType(type);
    const allocated = getTotalForType(type);
    return commitmentValue - allocated;
  };

  // Check if a type has valid allocation
  const isValidAllocationForType = (type) => {
    const remaining = getRemainingForType(type);
    return Math.abs(remaining) < 0.01; // Allow for rounding errors
  };

  // Check if any type is over budget
  const isAnyTypeOverBudget = () => {
    if (!isAllAtOnceMode) return false;
    const types = ['contractual', 'non-contractual', 'counterpart'];
    return types.some(type => getRemainingForType(type) < -0.01);
  };

  const renderBudgetItem = (item, index) => {
    return (
      <div key={`${item.id}-${index}`} className="budget-item-card" style={{ marginBottom: '15px' }}>
        <div className="budget-item-header">
          <div className="budget-item-title">
            <h4>
              <span className="budget-item-code">{item.itemCode}</span>
              <span className="budget-item-category">
                PBS Item
              </span>
            </h4>
            <p style={{ margin: '8px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              {item.itemDescription}
            </p>
          </div>
          <div className="budget-item-actions">
            <button
              className="icon-btn delete"
              onClick={() => handleDeleteClick(item.id, item)}
              title="Delete item"
            >
              🗑️
            </button>
          </div>
        </div>
        <div className="budget-item-details">
          <div className="detail-item">
            <div className="detail-label">Item Code</div>
            <div className="detail-value" style={{ fontWeight: '600', color: '#007bff' }}>{item.itemCode}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Item Description</div>
            <div className="detail-value">{item.itemDescription}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Quantity</div>
            <div className="detail-value">{item.quantity} units</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Unit Cost</div>
            <div className="detail-value">UGX {parseFloat(item.unitCost).toLocaleString()}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Duration</div>
            <div className="detail-value">
              FY {item.startFY}/{item.startFY + 1} - {item.endFY}/{item.endFY + 1}
            </div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Total Cost</div>
            <div className="detail-value" style={{ color: '#28a745', fontSize: '16px' }}>
              UGX {item.totalCost.toLocaleString()}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', fontSize: '13px', color: '#495057' }}>
          <strong>Justification:</strong> {item.justification}
        </div>
      </div>
    );
  };

  const renderBudgetItems = () => {
    if (!isAllAtOnceMode) {
      const itemsToRender = getConsolidatedBudgetItems();
      if (itemsToRender.length === 0) {
        return (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-text">No budget items added yet</div>
            <div className="empty-state-hint">Click "Add Budget Item" to begin breaking down your commitment</div>
          </div>
        );
      }
      return itemsToRender.map((item, index) => renderBudgetItem(item, index));
    }

    // All-at-once mode: Show grouped by commitment type
    const types = ['contractual', 'non-contractual', 'counterpart'];
    const typeLabels = { 'contractual': 'Contractual Commitment', 'non-contractual': 'Non-Contractual Commitment', 'counterpart': 'Counterpart Funding' };
    
    return types.map(type => {
      const items = allAtOnceBudgetItems[type] || [];
      const commitmentValue = getCommitmentValueForType ? getCommitmentValueForType(type) : 0;
      const allocated = getTotalForType(type);
      const remaining = getRemainingForType(type);
      const isOverBudget = remaining < 0;

      return (
        <div key={type} style={{ marginBottom: '30px', border: isOverBudget ? '3px solid #dc3545' : '2px solid #dee2e6', borderRadius: '8px', padding: '20px', background: isOverBudget ? '#fff5f5' : 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #007bff' }}>
            <h3 style={{ color: '#007bff', margin: 0 }}>
              {typeLabels[type]} ({items.length} items)
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ padding: '5px 15px', background: '#007bff', color: 'white', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                Allocated: UGX {allocated.toLocaleString()}
              </div>
              {isOverBudget && (
                <div style={{ padding: '5px 15px', background: '#dc3545', color: 'white', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', animation: 'pulse 2s infinite' }}>
                  Over by: UGX {Math.abs(remaining).toLocaleString()}
                </div>
              )}
            </div>
          </div>
          
          {commitmentValue > 0 && (
            <div style={{ marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '6px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: '#495057' }}>Total Commitment:</span>
                <span style={{ fontWeight: '600', color: '#007bff' }}>UGX {commitmentValue.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600', color: '#495057' }}>Amount Allocated:</span>
                <span style={{ fontWeight: '600', color: '#28a745' }}>UGX {allocated.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #dee2e6' }}>
                <span style={{ fontWeight: '700', fontSize: '16px', color: '#495057' }}>Remaining:</span>
                <span style={{ 
                  fontWeight: '700', 
                  fontSize: '16px', 
                  color: isOverBudget ? '#dc3545' : remaining < 0.01 ? '#28a745' : '#ffc107'
                }}>
                  {isOverBudget ? '-' : ''}UGX {Math.abs(remaining).toLocaleString()}
                  {remaining < 0 && ' ⚠️'}
                  {remaining > 0 && remaining < 0.01 && ' ✓'}
                </span>
              </div>
            </div>
          )}
          
          {items.map((item, index) => renderBudgetItem(item, index))}
        </div>
      );
    }).filter(Boolean);
  };

  const consolidatedItems = getConsolidatedBudgetItems();
  const totalCommitment = getTotalCommitmentValue();
  const totalItems = consolidatedItems.reduce((sum, item) => sum + item.totalCost, 0);
  const remaining = totalCommitment - totalItems;
  const numItems = consolidatedItems.length;

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">📊</div>
        <div className="section-title">
          <h2>Budget Items & Chart of Accounts</h2>
          <p>Break down the commitment by CoA codes and PBS activities</p>
        </div>
      </div>

      <div className="info-box">
        <p>
          <strong>PBS Integration:</strong> Each commitment must be broken down into specific budget items aligned with the Programme Budget System (PBS) and Chart of Accounts structure. This ensures proper tracking and reporting.
        </p>
      </div>

      <div className="annual-breakdown">
        <h3>🏷️ Budget Line Items</h3>
        <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '20px' }}>
          Add budget items with their respective Chart of Accounts codes and PBS activities
        </p>
        
        <div id="budgetItemsList">
          {renderBudgetItems()}
        </div>
        
        {isAllAtOnceMode ? (
          <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', border: '2px solid #2196F3' }}>
            <h4 style={{ color: '#1565C0', marginBottom: '15px' }}>Select Commitment Type for New Item</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ fontWeight: '600', color: '#1565C0', fontSize: '14px' }}>Commitment Type:</label>
              <select
                value={selectedCommitmentTypeForItem}
                onChange={(e) => setSelectedCommitmentTypeForItem(e.target.value)}
                style={{
                  padding: '10px 15px',
                  border: '2px solid #2196F3',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1565C0',
                  background: 'white',
                  cursor: 'pointer',
                  flex: '0 0 300px'
                }}
              >
                <option value="contractual">Contractual Commitment</option>
                <option value="non-contractual">Non-Contractual Commitment</option>
                <option value="counterpart">Counterpart Funding</option>
              </select>
            </div>
            <button className="add-year-btn" onClick={() => setIsModalOpen(true)} style={{ width: '100%' }}>
              ➕ Add Budget Item for {selectedCommitmentTypeForItem === 'contractual' ? 'Contractual' : 
                                      selectedCommitmentTypeForItem === 'non-contractual' ? 'Non-Contractual' : 
                                      'Counterpart'} Commitment
            </button>
          </div>
        ) : (
          <button className="add-year-btn" onClick={() => setIsModalOpen(true)}>
            ➕ Add Budget Item
          </button>
        )}
      </div>

      <div className="summary-section">
        <h3>Budget Summary</h3>
        
        {isAllAtOnceMode ? (
          <>
            {/* Per-type summaries */}
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <h4 style={{ color: '#007bff', marginTop: 0, marginBottom: '15px' }}>📊 Budget by Commitment Type</h4>
              
              <div className="summary-row">
                <span className="summary-label">Contractual Items:</span>
                <span className="summary-value">
                  {(allAtOnceBudgetItems.contractual || []).length} items | UGX {getTotalForType('contractual').toLocaleString()}
                </span>
              </div>
              <div className="summary-row" style={{ paddingLeft: '20px', fontSize: '13px', color: getRemainingForType('contractual') < 0 ? '#dc3545' : getRemainingForType('contractual') < 0.01 ? '#28a745' : '#ffc107' }}>
                <span className="summary-label">→ Remaining:</span>
                <span className="summary-value">
                  {getRemainingForType('contractual') < 0 ? '-' : ''}UGX {Math.abs(getRemainingForType('contractual')).toLocaleString()}
                  {getRemainingForType('contractual') < 0 && ' ⚠️ Over Budget'}
                  {getRemainingForType('contractual') >= 0 && getRemainingForType('contractual') < 0.01 && ' ✓ Balanced'}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Non-Contractual Items:</span>
                <span className="summary-value">
                  {(allAtOnceBudgetItems['non-contractual'] || []).length} items | UGX {getTotalForType('non-contractual').toLocaleString()}
                </span>
              </div>
              <div className="summary-row" style={{ paddingLeft: '20px', fontSize: '13px', color: getRemainingForType('non-contractual') < 0 ? '#dc3545' : getRemainingForType('non-contractual') < 0.01 ? '#28a745' : '#ffc107' }}>
                <span className="summary-label">→ Remaining:</span>
                <span className="summary-value">
                  {getRemainingForType('non-contractual') < 0 ? '-' : ''}UGX {Math.abs(getRemainingForType('non-contractual')).toLocaleString()}
                  {getRemainingForType('non-contractual') < 0 && ' ⚠️ Over Budget'}
                  {getRemainingForType('non-contractual') >= 0 && getRemainingForType('non-contractual') < 0.01 && ' ✓ Balanced'}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Counterpart Items:</span>
                <span className="summary-value">
                  {(allAtOnceBudgetItems.counterpart || []).length} items | UGX {getTotalForType('counterpart').toLocaleString()}
                </span>
              </div>
              <div className="summary-row" style={{ paddingLeft: '20px', fontSize: '13px', color: getRemainingForType('counterpart') < 0 ? '#dc3545' : getRemainingForType('counterpart') < 0.01 ? '#28a745' : '#ffc107' }}>
                <span className="summary-label">→ Remaining:</span>
                <span className="summary-value">
                  {getRemainingForType('counterpart') < 0 ? '-' : ''}UGX {Math.abs(getRemainingForType('counterpart')).toLocaleString()}
                  {getRemainingForType('counterpart') < 0 && ' ⚠️ Over Budget'}
                  {getRemainingForType('counterpart') >= 0 && getRemainingForType('counterpart') < 0.01 && ' ✓ Balanced'}
                </span>
              </div>
              
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #dee2e6' }}>
                <div className="summary-row">
                  <span className="summary-label">Total Items:</span>
                  <span className="summary-value">{numItems}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Grand Total:</span>
                  <span className="summary-value" style={{ color: '#28a745', fontWeight: 'bold' }}>
                    UGX {totalItems.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="summary-row">
              <span className="summary-label">Total Commitment Value:</span>
              <span className="summary-value">
                UGX {totalCommitment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Total Budget Items:</span>
              <span className="summary-value">
                UGX {totalItems.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Number of Items:</span>
              <span className="summary-value">{numItems}</span>
            </div>
            <div className="total-row">
              <span>Remaining to Allocate:</span>
              <span style={{ color: '#28a745' }}>
                UGX {remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </>
        )}
      </div>

      {isAllAtOnceMode && isAnyTypeOverBudget() && (
        <div className="warning-box" style={{ background: '#fff5f5', border: '3px solid #dc3545' }}>
          <p style={{ color: '#dc3545', fontWeight: 'bold', fontSize: '16px' }}>
            ⚠️ BUDGET ALERT: One or more commitment types exceed their allocated budget!
          </p>
          <p style={{ marginTop: '10px' }}>
            Please adjust your budget items to ensure allocations match commitment values. You cannot proceed until all allocations are balanced.
          </p>
        </div>
      )}

      <div className="warning-box">
        <p>
          <strong>MTEF Compliance:</strong> Budget allocations will be validated against approved MTEF ceilings for your MDA. Ensure total amounts align with budget frameworks.
        </p>
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Previous
        </button>
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={isAllAtOnceMode && isAnyTypeOverBudget()}
          style={{ 
            opacity: isAllAtOnceMode && isAnyTypeOverBudget() ? 0.5 : 1,
            cursor: isAllAtOnceMode && isAnyTypeOverBudget() ? 'not-allowed' : 'pointer'
          }}
        >
          Next Step →
        </button>
      </div>

      <BudgetItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={addBudgetItem}
        projectData={projectData}
        pbsData={pbsData}
        pbsBudgetData={pbsBudgetData}
        loading={loadingPbsData}
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="delete"
        title="Delete Budget Item"
        message="Are you sure you want to delete this budget line item?"
        confirmText="Delete Item"
        cancelText="Cancel"
        details={
          itemToDelete && (
            <div style={{ fontSize: '14px', color: '#495057' }}>
              <div style={{ marginBottom: '10px', fontWeight: '600', color: '#212529' }}>
                Item Details:
              </div>
              <div style={{ lineHeight: '1.8' }}>
                <div><strong>Code:</strong> {itemToDelete.itemCode}</div>
                <div><strong>Description:</strong> {itemToDelete.itemDescription}</div>
                <div><strong>Total Cost:</strong> UGX {itemToDelete.totalCost.toLocaleString()}</div>
              </div>
              <div style={{ 
                marginTop: '15px', 
                padding: '12px', 
                background: '#fff3cd', 
                borderRadius: '6px',
                border: '1px solid #ffc107',
                color: '#856404',
                fontSize: '13px'
              }}>
                <strong>⚠️ Warning:</strong> This action cannot be undone. The budget item will be permanently removed from this commitment.
              </div>
            </div>
          )
        }
      />
    </div>
  );
};

export default Step3;
