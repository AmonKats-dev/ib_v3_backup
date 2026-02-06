import React, { useState, useEffect } from 'react';
import { generateFiscalYears } from '../utils/constants';

const BudgetItemModal = ({ isOpen, onClose, onAddItem, projectData, pbsData, pbsBudgetData = [], loading = false }) => {
  const [formData, setFormData] = useState({
    itemCode: '',
    itemDescription: '',
    budgetOutputDescription: '',
    quantity: '1',
    unitCost: '',
    totalCost: '',
    startFY: '',
    endFY: '',
    justification: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Recalculate total whenever unitCost or quantity changes
  useEffect(() => {
    if (isOpen && (formData.unitCost || formData.quantity)) {
      const quantityValue = formData.quantity || '1';
      const unitCostValue = formData.unitCost || '0';
      
      const quantity = parseFloat(quantityValue) || 1;
      const unitCostStr = unitCostValue.toString().replace(/[^0-9.]/g, '');
      const unitCost = parseFloat(unitCostStr) || 0;
      const total = quantity * unitCost;
      
      updateFormData('totalCost', total.toString());
    }
  }, [formData.unitCost, formData.quantity, isOpen]);

  const resetForm = () => {
    setFormData({
      itemCode: '',
      itemDescription: '',
      budgetOutputDescription: '',
      quantity: '1',
      unitCost: '',
      totalCost: '',
      startFY: '',
      endFY: '',
      justification: ''
    });
    setErrors({});
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleItemCodeChange = (itemCode) => {
    const selectedItem = pbsBudgetData.find(item => item.Item_Code === itemCode);
    if (selectedItem) {
      updateFormData('itemCode', selectedItem.Item_Code);
      updateFormData('itemDescription', selectedItem.Description);
      updateFormData('budgetOutputDescription', selectedItem.Budget_Output_Description);
    }
  };

  const formatNumber = (value) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = value.toString().replace(/[^0-9.]/g, '');
    return cleaned;
  };

  // Format number with commas for display
  const formatWithCommas = (value) => {
    if (!value || value === '') return '';
    const cleaned = value.toString().replace(/[^0-9.]/g, '');
    if (cleaned === '' || cleaned === '.') return '';
    
    // Handle decimal numbers
    const parts = cleaned.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  const calculateItemTotal = () => {
    // Get raw values
    const quantityValue = formData.quantity || '1';
    const unitCostValue = formData.unitCost || '0';
    
    // Parse quantity
    const quantity = parseFloat(quantityValue) || 1;
    
    // Parse unit cost - handle commas and other formatting
    let unitCostStr = unitCostValue.toString();
    // Remove commas, spaces, and other non-numeric characters except decimal point
    unitCostStr = unitCostStr.replace(/[^0-9.]/g, '');
    const unitCost = parseFloat(unitCostStr) || 0;
    
    // Calculate total
    const total = quantity * unitCost;
    
    console.log('Calculation debug:', {
      originalQuantity: formData.quantity,
      parsedQuantity: quantity,
      originalUnitCost: formData.unitCost,
      cleanedUnitCostStr: unitCostStr,
      parsedUnitCost: unitCost,
      calculatedTotal: total
    });
    
    updateFormData('totalCost', total.toString());
  };

  const handleAddItem = () => {
    const newErrors = {};
    
    if (!formData.itemCode) newErrors.itemCode = 'Item Code is required';
    if (!formData.itemDescription) newErrors.itemDescription = 'Item Description is required';
    // PBS Activity validation removed as field is hidden
    if (!formData.totalCost) newErrors.totalCost = 'Total cost is required';
    if (!formData.startFY) newErrors.startFY = 'Start fiscal year is required';
    if (!formData.endFY) newErrors.endFY = 'End fiscal year is required';
    if (!formData.justification) newErrors.justification = 'Justification is required';

    if (parseFloat(formData.totalCost) <= 0) {
      newErrors.totalCost = 'Total cost must be greater than zero';
    }

    if (parseInt(formData.endFY) < parseInt(formData.startFY)) {
      newErrors.endFY = 'End fiscal year must be equal to or after start fiscal year';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const item = {
        id: Date.now(), // Simple ID generation
        itemCode: formData.itemCode,
        itemDescription: formData.itemDescription,
        budgetOutputDescription: formData.budgetOutputDescription,
        quantity: formData.quantity,
        unitCost: formData.unitCost,
        totalCost: parseFloat(formData.totalCost),
        startFY: parseInt(formData.startFY),
        endFY: parseInt(formData.endFY),
        justification: formData.justification,
        annualBreakdown: {}
      };

      onAddItem(item);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Budget Line Item</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="info-box" style={{ marginBottom: '25px' }}>
            <p>
              <strong>Instructions:</strong> Select the appropriate PBS budget item from the available options for this project and MDA. Each item will be broken down by fiscal year in the next step.
            </p>
            {/* {loading && (
              <div style={{ color: '#007bff', fontSize: '14px', marginTop: '10px' }}>
                🔄 Loading PBS budget data...
              </div>
            )} */}
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="itemCode">
                Item Code <span className="required">*</span>
              </label>
              <select
                id="itemCode"
                value={formData.itemCode}
                onChange={(e) => handleItemCodeChange(e.target.value)}
                className={errors.itemCode ? 'error' : ''}
                disabled={loading || pbsBudgetData.length === 0}
              >
                <option value="">
                  {loading ? "Loading Chart of Accounts Item Codes..." : "-- Select Item Code --"}
                </option>
                {pbsBudgetData.map(item => (
                  <option key={item.Item_Code} value={item.Item_Code}>
                    {item.Item_Code} - {item.Description}
                  </option>
                ))}
              </select>
              {errors.itemCode && (
                <div className="validation-message show">{errors.itemCode}</div>
              )}
              {pbsBudgetData.length === 0 && !loading && (
                <div className="validation-message" style={{ color: '#856404' }}>
                  No PBS budget items found for this project and MDA
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="itemDescription">
                Item Description <span className="required">*</span>
                {/* {formData.itemDescription && (
                  <span style={{ fontSize: '12px', color: '#28a745', marginLeft: '8px' }}>
                    ✓ Auto-populated from PBS
                  </span>
                )} */}
              </label>
              <input
                type="text"
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => updateFormData('itemDescription', e.target.value)}
                placeholder="Item description from PBS"
                className={errors.itemDescription ? 'error' : ''}
                style={formData.itemDescription ? { 
                  backgroundColor: '#f8f9fa', 
                  borderColor: '#6c757d',
                  cursor: 'not-allowed'
                } : {}}
                readOnly={!!formData.itemDescription}
              />
              {errors.itemDescription && (
                <div className="validation-message show">{errors.itemDescription}</div>
              )}
            </div>

            {/* PBS Activity/Output field hidden as requested */}
            <div className="form-group full-width" style={{ display: 'none' }}>
              <label htmlFor="budgetOutputDescription">
                PBS Activity/Output <span className="required">*</span>
              </label>
              <input
                type="text"
                id="budgetOutputDescription"
                value={formData.budgetOutputDescription}
                onChange={(e) => updateFormData('budgetOutputDescription', e.target.value)}
                placeholder="Budget output description from PBS"
                className={errors.budgetOutputDescription ? 'error' : ''}
                style={formData.budgetOutputDescription ? { 
                  backgroundColor: '#f8f9fa', 
                  borderColor: '#6c757d',
                  cursor: 'not-allowed'
                } : {}}
                readOnly={!!formData.budgetOutputDescription}
              />
              {errors.budgetOutputDescription && (
                <div className="validation-message show">{errors.budgetOutputDescription}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="itemQuantity">Quantity/Units</label>
              <input
                type="number"
                id="itemQuantity"
                value={formData.quantity}
                onChange={(e) => {
                  updateFormData('quantity', e.target.value);
                  calculateItemTotal();
                }}
                placeholder="e.g., 1"
                step="1"
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="itemUnitCost">Unit Cost (UGX)</label>
              <input
                type="text"
                id="itemUnitCost"
                value={formatWithCommas(formData.unitCost)}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Clean the input - remove non-numeric characters except decimal point
                  const cleanedValue = inputValue.replace(/[^0-9.]/g, '');
                  updateFormData('unitCost', cleanedValue);
                }}
                placeholder="0"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="itemTotalCost">
                Total Item Cost (UGX) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="itemTotalCost"
                value={formatWithCommas(formData.totalCost)}
                placeholder="0"
                style={{ 
                  fontWeight: '600', 
                  fontSize: '16px',
                  backgroundColor: '#f8f9fa',
                  borderColor: '#6c757d',
                  cursor: 'not-allowed'
                }}
                className={errors.totalCost ? 'error' : ''}
                readOnly
              />
              {errors.totalCost && (
                <div className="validation-message show">{errors.totalCost}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="itemStartFY">
                Start Fiscal Year <span className="required">*</span>
              </label>
              <select
                id="itemStartFY"
                value={formData.startFY}
                onChange={(e) => updateFormData('startFY', e.target.value)}
                className={errors.startFY ? 'error' : ''}
              >
                <option value="">-- Select FY --</option>
                {generateFiscalYears().map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
              {errors.startFY && (
                <div className="validation-message show">{errors.startFY}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="itemEndFY">
                End Fiscal Year <span className="required">*</span>
              </label>
              <select
                id="itemEndFY"
                value={formData.endFY}
                onChange={(e) => updateFormData('endFY', e.target.value)}
                className={errors.endFY ? 'error' : ''}
              >
                <option value="">-- Select FY --</option>
                {generateFiscalYears().map(year => (
                  <option key={year.value} value={year.value}>{year.label}</option>
                ))}
              </select>
              {errors.endFY && (
                <div className="validation-message show">{errors.endFY}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="itemJustification">
                Item Justification <span className="required">*</span>
              </label>
              <textarea
                id="itemJustification"
                value={formData.justification}
                onChange={(e) => updateFormData('justification', e.target.value)}
                placeholder="Explain the necessity and expected outcomes of this budget item"
                className={errors.justification ? 'error' : ''}
              />
              {errors.justification && (
                <div className="validation-message show">{errors.justification}</div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={handleAddItem}>Add Item</button>
        </div>
      </div>
    </div>
  );
};

export default BudgetItemModal;
