import React, { useState, useEffect } from 'react';

const Step3_5 = ({ budgetItems, setBudgetItems, formData, updateFormData, errors, nextStep, prevStep, isAllAtOnceMode, allAtOnceBudgetItems, setAllAtOnceBudgetItems }) => {
  const [annualBreakdowns, setAnnualBreakdowns] = useState({});
  const [displayValues, setDisplayValues] = useState({});

  // Get consolidated items for all-at-once mode
  const getItemsToDisplay = () => {
    if (!isAllAtOnceMode) {
      return budgetItems;
    }
    
    // Consolidate items from all commitment types
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

  // Format number with commas for display (only integers, no forced decimals)
  const formatWithCommas = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    
    // Handle string input that might contain decimals
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '' || trimmed === '.') return '';
      
      // Check if it contains a decimal point
      if (trimmed.includes('.')) {
        const parts = trimmed.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];
        
        // Format integer part with commas
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Return formatted value with decimal part
        return decimalPart ? `${formattedInteger}.${decimalPart}` : `${formattedInteger}.`;
      } else {
        // No decimal, just format as integer
        const numValue = parseFloat(trimmed);
        if (isNaN(numValue)) return '';
        return numValue.toLocaleString('en-US');
      }
    }
    
    // Handle numeric value
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return '';
    return numValue.toLocaleString('en-US');
  };

  useEffect(() => {
    // Initialize annual breakdowns for each budget item
    const initialBreakdowns = {};
    const itemsToDisplay = getItemsToDisplay();
    itemsToDisplay.forEach(item => {
      if (!item.annualBreakdown || Object.keys(item.annualBreakdown).length === 0) {
        initialBreakdowns[item.id] = {};
      } else {
        initialBreakdowns[item.id] = { ...item.annualBreakdown };
      }
    });
    setAnnualBreakdowns(initialBreakdowns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetItems, allAtOnceBudgetItems]);

  // Update budget items in the correct location based on mode
  const updateItemInBudget = (itemId, updatedItem) => {
    if (isAllAtOnceMode) {
      // Find which commitment type this item belongs to and update it
      let itemFound = false;
      const updatedItems = { ...allAtOnceBudgetItems };
      
      ['contractual', 'non-contractual', 'counterpart'].forEach(type => {
        const items = updatedItems[type] || [];
        const itemIndex = items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
          updatedItems[type] = items.map((item, idx) => 
            idx === itemIndex ? updatedItem : item
          );
          itemFound = true;
        }
      });
      
      if (itemFound) {
        setAllAtOnceBudgetItems(updatedItems);
      }
    } else {
      setBudgetItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ));
    }
  };

  const updateAnnualBreakdown = (itemId, year, inputValue) => {
    // Remove commas and parse the numeric value
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    const amount = numericValue === '' ? 0 : parseFloat(numericValue) || 0;
    
    const newBreakdowns = {
      ...annualBreakdowns,
      [itemId]: {
        ...annualBreakdowns[itemId],
        [year]: amount
      }
    };
    setAnnualBreakdowns(newBreakdowns);

    // Update display value for the specific input (keep empty string if empty)
    setDisplayValues(prev => ({
      ...prev,
      [`${itemId}-${year}`]: numericValue === '' ? '' : numericValue
    }));

    // Update the budget item in the parent state (handles both modes)
    const itemsToDisplay = getItemsToDisplay();
    const item = itemsToDisplay.find(i => i.id === itemId);
    if (item) {
      updateItemInBudget(itemId, { ...item, annualBreakdown: newBreakdowns[itemId] });
    }
  };

  const updateAnnualPercentages = (itemId) => {
    const itemsToDisplay = getItemsToDisplay();
    const item = itemsToDisplay.find(i => i.id === itemId);
    if (!item) return;

    const breakdown = annualBreakdowns[itemId] || {};
    let totalAllocated = 0;
    
    Object.values(breakdown).forEach(amount => {
      totalAllocated += amount;
    });

    return { totalAllocated, breakdown };
  };

  const generateAnnualBreakdownTables = () => {
    const itemsToDisplay = getItemsToDisplay();
    
    if (itemsToDisplay.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">💰</div>
          <div className="empty-state-text">No budget items to allocate</div>
          <div className="empty-state-hint">Please go back and add budget items first</div>
        </div>
      );
    }

    // In all-at-once mode, group by commitment type
    if (isAllAtOnceMode) {
      const grouped = {};
      itemsToDisplay.forEach(item => {
        const type = item.commitmentType || 'Other';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(item);
      });

      const types = ['Contractual', 'Non-Contractual', 'Counterpart'];
      const typeLabels = { 
        'Contractual': 'Contractual Commitment', 
        'Non-Contractual': 'Non-Contractual Commitment', 
        'Counterpart': 'Counterpart Funding' 
      };

      return types.map(type => {
        const items = grouped[type] || [];
        if (items.length === 0) return null;

        return (
          <div key={type} style={{ marginBottom: '40px', border: '2px solid #dee2e6', borderRadius: '8px', padding: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px', 
              paddingBottom: '15px', 
              borderBottom: '2px solid #007bff' 
            }}>
              <h3 style={{ color: '#007bff', margin: 0 }}>
                {typeLabels[type]} - Annual Allocation
              </h3>
              <span style={{ 
                padding: '5px 15px', 
                background: '#007bff', 
                color: 'white', 
                borderRadius: '20px', 
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            {items.map((item, index) => renderItemTable(item, index))}
          </div>
        );
      }).filter(Boolean);
    }

    // Single commitment mode
    return itemsToDisplay.map((item, index) => renderItemTable(item, index));
  };

  const renderItemTable = (item, index) => {
      const years = [];
      for (let year = item.startFY; year <= item.endFY; year++) {
        years.push(year);
      }

      const { totalAllocated, breakdown } = updateAnnualPercentages(item.id);

      return (
        <div key={item.id} className="annual-table-container" style={{ marginBottom: '20px' }}>
          <div className="annual-table-header">
            <h4>
              <span style={{ 
                padding: '5px 12px', 
                background: '#007bff', 
                color: 'white', 
                borderRadius: '6px', 
                fontSize: '13px', 
                fontWeight: '600',
                marginRight: '10px' 
              }}>
                {item.itemCode}
              </span>
              {item.itemDescription}
              {isAllAtOnceMode && item.commitmentType && (
                <span style={{ 
                  marginLeft: '15px', 
                  fontSize: '12px', 
                  padding: '3px 10px', 
                  background: '#f0f4ff', 
                  color: '#007bff', 
                  borderRadius: '12px',
                  fontWeight: 'normal' 
                }}>
                  ({item.commitmentType})
                </span>
              )}
            </h4>
            <div style={{ fontWeight: 'bold', color: '#28a745' }}>
              Total: UGX {item.totalCost.toLocaleString()}
            </div>
          </div>
          <table className="annual-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Fiscal Year</th>
                <th style={{ width: '40%' }}>Amount (UGX)</th>
                <th style={{ width: '30%' }}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {years.map(year => {
                const amount = breakdown[year] || 0;
                const percentage = item.totalCost > 0 ? (amount / item.totalCost * 100).toFixed(1) : 0;
                const displayKey = `${item.id}-${year}`;
                
                // Show empty string if no user input and amount is 0, otherwise format with commas
                let displayValue = '';
                if (displayValues[displayKey] !== undefined && displayValues[displayKey] !== '') {
                  // User has typed something - format it with commas as user types
                  displayValue = formatWithCommas(displayValues[displayKey]);
                } else if (amount > 0) {
                  // There's an existing value - format it as integer
                  displayValue = amount.toLocaleString('en-US');
                }
                
                return (
                  <tr key={year}>
                    <td><strong>FY {year}/{year + 1}</strong></td>
                    <td>
                      <input
                        type="text"
                        className="annual-amount"
                        value={displayValue}
                        onChange={(e) => updateAnnualBreakdown(item.id, year, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <span className="annual-percentage">{percentage}%</span>
                    </td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td><strong>Total Allocated</strong></td>
                <td>
                  <span 
                    className="item-total-allocated"
                    style={{ 
                      color: Math.abs(totalAllocated - item.totalCost) < 0.01 ? '#28a745' : '#dc3545' 
                    }}
                  >
                    UGX {totalAllocated.toLocaleString()}
                  </span>
                </td>
                <td>
                  <span 
                    className="item-total-percentage"
                    style={{ 
                      color: Math.abs(totalAllocated - item.totalCost) < 0.01 ? '#28a745' : '#dc3545' 
                    }}
                  >
                    {item.totalCost > 0 ? (totalAllocated / item.totalCost * 100).toFixed(1) : 0}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
  };

  return (
    <div className="form-section active">
      <div className="section-header">
        <div className="section-icon">💰</div>
        <div className="section-title">
          <h2>Annual Financial Breakdown</h2>
          <p>Specify year-by-year allocation for each budget item</p>
        </div>
      </div>

      <div className="warning-box">
        <p>
          <strong>Multi-Year Planning:</strong> For each budget item, specify the allocation across fiscal years. The total must match the item amount.
        </p>
      </div>

      {isAllAtOnceMode && (
        <div className="info-box" style={{ background: '#e3f2fd', borderLeft: '4px solid #2196F3', marginTop: '20px' }}>
          <p style={{ margin: 0, color: '#1565C0', fontSize: '14px', lineHeight: '1.6' }}>
            <strong>📋 All Commitment Types:</strong> You are allocating annual financial breakdowns for all three commitment types. Items are grouped by commitment type for easier management.
          </p>
        </div>
      )}

      <div id="annualBreakdownContainer">
        {generateAnnualBreakdownTables()}
      </div>

      <div className="form-group full-width" style={{ marginTop: '30px' }}>
        <label htmlFor="justification">
          Overall Allocation Justification <span className="required">*</span>
        </label>
        <textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => updateFormData('justification', e.target.value)}
          placeholder="Explain the rationale for the budget breakdown, annual phasing, and alignment with project milestones and MTEF ceilings"
          className={errors.justification ? 'error' : ''}
        />
        {errors.justification && (
          <div className="validation-message show">{errors.justification}</div>
        )}
      </div>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={prevStep}>
          ← Previous
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          Next Step →
        </button>
      </div>
    </div>
  );
};

export default Step3_5;
