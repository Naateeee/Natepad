(function () {
  // =====================================================================
  // THEME / COLOR PICKER
  // =====================================================================
  const root = document.documentElement;
  const colorPicker = document.getElementById('primaryColorPicker');
  const modeToggle = document.querySelector('.light-dark-mode');

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const fullValue = value.length === 3 ? value.split('').map((part) => part + part).join('') : value;
    const number = Number.parseInt(fullValue, 16);
    return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
  }

  function adjustColor(hex, amount) {
    const { r, g, b } = hexToRgb(hex);
    const adjust = (channel) => Math.max(0, Math.min(255, channel + amount)).toString(16).padStart(2, '0');
    return `#${adjust(r)}${adjust(g)}${adjust(b)}`;
  }

  function updateLogoColor() {
    const theme = root.getAttribute('data-bs-theme') || 'light';
    const isCustom = root.getAttribute('data-theme-colors') === 'custom';
    const customColor = sessionStorage.getItem('primary-theme-color');
    const color = isCustom && customColor ? customColor : theme === 'dark' ? '#ffffff' : '#111827';
    const logo = document.querySelector('.app-logo-image');
    root.style.setProperty('--logo-color', color);
    if (logo) logo.style.background = color;
  }

  function applyThemeColor(color) {
    const safeColor = /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#405189';
    const { r, g, b } = hexToRgb(safeColor);
    const headerTint = `rgba(${r}, ${g}, ${b}, 0.10)`;
    const bodyTint = `rgba(${r}, ${g}, ${b}, 0.04)`;

    root.style.setProperty('--custom-primary', safeColor);
    root.style.setProperty('--custom-primary-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--custom-primary-text-emphasis', adjustColor(safeColor, -25));
    root.style.setProperty('--vz-primary', safeColor);
    root.style.setProperty('--vz-primary-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--vz-primary-text-emphasis', adjustColor(safeColor, -25));
    root.style.setProperty('--vz-border-color', `rgba(${r}, ${g}, ${b}, 0.22)`);

    const topbar = document.getElementById('page-topbar');
    if (topbar) {
      topbar.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.12)`;
      topbar.style.borderBottomColor = `rgba(${r}, ${g}, ${b}, 0.28)`;
    }
    document.querySelectorAll('.page-title-box, .card-header').forEach((element) => {
      element.style.backgroundColor = headerTint;
      element.style.borderBottomColor = `rgba(${r}, ${g}, ${b}, 0.28)`;
    });
    document.querySelectorAll('.card-body').forEach((element) => {
      element.style.backgroundColor = bodyTint;
    });

    root.setAttribute('data-theme-colors', 'custom');
    sessionStorage.setItem('data-theme-colors', 'custom');
    sessionStorage.setItem('primary-theme-color', safeColor);
    updateLogoColor();
    if (colorPicker) colorPicker.value = safeColor;
  }

  if (colorPicker) {
    applyThemeColor(sessionStorage.getItem('primary-theme-color') || '#405189');
    colorPicker.addEventListener('input', (event) => applyThemeColor(event.target.value));
    colorPicker.addEventListener('dblclick', () => {
      root.setAttribute('data-theme-colors', 'default');
      sessionStorage.setItem('data-theme-colors', 'default');
      sessionStorage.removeItem('primary-theme-color');
      applyThemeColor('#405189');
    });
  }

  if (modeToggle) {
    const icon = modeToggle.querySelector('i');
    const setTheme = (theme) => {
      root.setAttribute('data-bs-theme', theme);
      sessionStorage.setItem('data-bs-theme', theme);
      if (icon) icon.className = theme === 'dark' ? 'bx bx-sun fs-22' : 'bx bx-moon fs-22';
      updateLogoColor();
    };
    setTheme(sessionStorage.getItem('data-bs-theme') || 'light');
    modeToggle.addEventListener('click', () => setTheme(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'));
  } else {
    updateLogoColor();
  }

  // =====================================================================
  // STATIC SELECT OPTIONS (populated into blank <select> shells in HTML)
  // =====================================================================
  const SELECT_OPTIONS = {
    customer: [
      { value: '1', text: 'Account Holder' },
      { value: '2', text: 'Spouse' },
      { value: '4', text: 'Authorized person' },
      { value: '5', text: 'Others' },
    ],
    databaseCleanup: [
      { value: '1', text: 'Updated' },
      { value: '2', text: 'Not Updated - Mobile Number' },
      { value: '3', text: 'Not Updated - Email Address' },
      { value: '4', text: 'Not Updated - Both' },
    ],
    serviceType: [
      { value: '1', text: 'TECH' },
      { value: '2', text: 'BILLING' },
      { value: '3', text: 'ACCOUNT INFORMATION' },
      { value: '4', text: 'PROMO' },
      { value: '5', text: 'PROGRAMMING' },
      { value: '6', text: 'LOADING' },
      { value: '7', text: 'PLDT' },
      { value: '8', text: 'PPV' },
      { value: '9', text: 'PARTNER' },
      { value: '10', text: 'GENERAL INQUIRY' },
      { value: '11', text: 'OTT' },
      { value: '12', text: 'Others' },
    ],
    accountType: [
      { value: '1', text: 'Postpaid' },
      { value: '2', text: 'Prepaid' },
      { value: '3', text: 'Satlite' },
      { value: '4', text: 'Cignal Play' },
      { value: '5', text: 'Pilipinas Live' },
      { value: '6', text: 'Other OTTs - HBO/Disney/Hayu' },
    ],
  };

  function populateOptionsList(select, options) {
    select.innerHTML = '<option selected></option>';
    options.forEach(({ value, text }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    });
  }

  function populateSelectOptions() {
    Object.entries(SELECT_OPTIONS).forEach(([selectId, options]) => {
      const select = document.getElementById(selectId);
      if (!select) return;
      populateOptionsList(select, options);
    });
  }

  populateSelectOptions();

  // =====================================================================
  // CATEGORY (depends on Service Type) + QUALI CODE LOOKUP
  // =====================================================================
  const CATEGORY_BY_SERVICE = {
    TECH: ['Signal Input Error', 'Hardware Issue', 'Not in Front of Unit', 'Smart Card Decode Error', 'A/V Output Failure', 'Others'],
    BILLING: ['Billing Explanation', 'Billing Amount due Inquiry', 'Payment Report', 'Others'],
    'ACCOUNT INFORMATION': ['Account Details', 'Account Status - ACTIVE / DISCONNECTED'],
    PROMO: ['Plan Upgrade', 'Plan Downgrade', 'Additional Box', 'Box Upgrade', 'Other Promo Inquries'],
    PROGRAMMING: ['Others'],
    LOADING: ['Load Concerns'],
    PLDT: ['PLDT Concerns', 'PLDT Activation', 'PLDT Not In Front'],
    PPV: ['PPV Concerns'],
    PARTNER: ['SMS Issues'],
    'GENERAL INQUIRY': ['All Other categories'],
    OTT: ['Product Inquiry', 'Tech Issues', 'Payment Issues', 'Other Issues'],
  };

  // Keys: "SERVICE|CATEGORY|ACCOUNT TYPE" -> Quali Code
  const QUALI_CODE_BY_COMBO = {
    'TECH|Signal Input Error|Postpaid': '1100',
    'TECH|Signal Input Error|Prepaid': '2100',
    'TECH|Signal Input Error|Satlite': '3100',
    'TECH|Hardware Issue|Postpaid': '1101',
    'TECH|Hardware Issue|Prepaid': '2101',
    'TECH|Hardware Issue|Satlite': '3101',
    'TECH|Not in Front of Unit|Postpaid': '1102',
    'TECH|Not in Front of Unit|Prepaid': '2102',
    'TECH|Not in Front of Unit|Satlite': '3102',
    'TECH|Smart Card Decode Error|Postpaid': '1103',
    'TECH|Smart Card Decode Error|Prepaid': '2103',
    'TECH|Smart Card Decode Error|Satlite': '3103',
    'TECH|A/V Output Failure|Postpaid': '1104',
    'TECH|A/V Output Failure|Prepaid': '2104',
    'TECH|A/V Output Failure|Satlite': '3104',
    'TECH|Others|Postpaid': '1105',
    'TECH|Others|Prepaid': '2105',
    'TECH|Others|Satlite': '3105',

    'BILLING|Billing Explanation|Postpaid': '1300',
    'BILLING|Billing Amount due Inquiry|Postpaid': '1301',
    'BILLING|Payment Report|Postpaid': '1302',
    'BILLING|Others|Postpaid': '1303',

    'ACCOUNT INFORMATION|Account Details|Postpaid': '1400',
    'ACCOUNT INFORMATION|Account Details|Prepaid': '2400',
    'ACCOUNT INFORMATION|Account Details|Satlite': '3400',
    'ACCOUNT INFORMATION|Account Status - ACTIVE / DISCONNECTED|Postpaid': '1200',
    'ACCOUNT INFORMATION|Account Status - ACTIVE / DISCONNECTED|Prepaid': '2200',
    'ACCOUNT INFORMATION|Account Status - ACTIVE / DISCONNECTED|Satlite': '3200',

    'PROMO|Plan Upgrade|Postpaid': '1500',
    'PROMO|Plan Downgrade|Postpaid': '1501',
    'PROMO|Additional Box|Postpaid': '1502',
    'PROMO|Box Upgrade|Postpaid': '1503',
    'PROMO|Box Upgrade|Prepaid': '2503',
    'PROMO|Box Upgrade|Satlite': '3503',
    'PROMO|Other Promo Inquries|Postpaid': '1504',
    'PROMO|Other Promo Inquries|Prepaid': '2504',
    'PROMO|Other Promo Inquries|Satlite': '3504',

    'PROGRAMMING|Others|Postpaid': '1431',
    'PROGRAMMING|Others|Prepaid': '2431',
    'PROGRAMMING|Others|Satlite': '3431',

    'LOADING|Load Concerns|Prepaid': '2410',
    'LOADING|Load Concerns|Satlite': '3410',

    'PLDT|PLDT Concerns|Postpaid': '1420',
    'PLDT|PLDT Activation|Postpaid': '1421',
    'PLDT|PLDT Not In Front|Postpaid': '1422',

    'PPV|PPV Concerns|Postpaid': '1440',
    'PPV|PPV Concerns|Prepaid': '2440',
    'PPV|PPV Concerns|Satlite': '3440',

    'PARTNER|SMS Issues|Postpaid': '1510',
    'PARTNER|SMS Issues|Prepaid': '2510',
    'PARTNER|SMS Issues|Satlite': '3510',

    'GENERAL INQUIRY|All Other categories|Postpaid': '1520',
    'GENERAL INQUIRY|All Other categories|Prepaid': '2520',
    'GENERAL INQUIRY|All Other categories|Satlite': '3520',

    'OTT|Product Inquiry|Cignal Play': '4800',
    'OTT|Product Inquiry|Pilipinas Live': '5800',
    'OTT|Product Inquiry|Other OTTs - HBO/Disney/Hayu': '7800',
    'OTT|Tech Issues|Cignal Play': '4801',
    'OTT|Tech Issues|Pilipinas Live': '5801',
    'OTT|Tech Issues|Other OTTs - HBO/Disney/Hayu': '7801',
    'OTT|Payment Issues|Cignal Play': '4802',
    'OTT|Payment Issues|Pilipinas Live': '5802',
    'OTT|Payment Issues|Other OTTs - HBO/Disney/Hayu': '7802',
    'OTT|Other Issues|Cignal Play': '4803',
    'OTT|Other Issues|Pilipinas Live': '5803',
    'OTT|Other Issues|Other OTTs - HBO/Disney/Hayu': '7803',
  };

  // =====================================================================
  // CENTRALIZED INPUT ELEMENTS
  // =====================================================================
  const inputs = {
    notesValue: document.getElementById('notes_value'),
    customerSelect: document.getElementById('customer'),
    customerOthersInput: document.getElementById('customerOthers'),
    databaseCleanupSelect: document.getElementById('databaseCleanup'),
    newMobileNumberInput: document.getElementById('newMobileNumber'),
    newEmailAddressInput: document.getElementById('newEmailAddress'),
    accountTypeSelect: document.getElementById('accountType'),
    serviceTypeSelect: document.getElementById('serviceType'),
    serviceOthersInput: document.getElementById('serviceOthers'),
    categorySelect: document.getElementById('category'),
    resolutionSelect: document.getElementById('resolution'),
    upsellSelect: document.getElementById('upsell'),
    ticketNumberInput: document.getElementById('ticketNumber'),
    qualiCodeInput: document.getElementById('qualiCode'),
    notesCharacterCount: document.getElementById('notesCharacterCount'),
  };

  if (inputs.newMobileNumberInput) {
    inputs.newMobileNumberInput.addEventListener('input', () => {
      inputs.newMobileNumberInput.value = inputs.newMobileNumberInput.value.replace(/\D/g, '').slice(0, 11);
    });
  }

  const newEmailAddressFeedback = document.getElementById('newEmailAddressFeedback');
  function validateNewEmailAddress(showFeedback = true) {
    const email = inputs.newEmailAddressInput;
    if (!email) return true;
    const isValid = email.checkValidity();
    if (showFeedback) {
      email.classList.toggle('is-invalid', !isValid);
      if (newEmailAddressFeedback) {
        newEmailAddressFeedback.textContent = email.value.trim()
          ? 'Enter a valid email address, such as name@example.com.'
          : 'Email address is required.';
      }
    }
    return isValid;
  }

  if (inputs.newEmailAddressInput) {
    inputs.newEmailAddressInput.addEventListener('blur', () => validateNewEmailAddress());
    inputs.newEmailAddressInput.addEventListener('input', () => {
      if (inputs.newEmailAddressInput.classList.contains('is-invalid')) validateNewEmailAddress();
    });
  }

  function getDisplayValue(input) {
    if (!input) return '';
    return input.tagName === 'SELECT' ? input.selectedOptions[0]?.text.trim() || '' : input.value.trim();
  }

  function styleNotesArea() {
    if (!inputs.notesValue) return;
    inputs.notesValue.style.fontFamily = 'Courier New, Courier, monospace';
    inputs.notesValue.style.fontSize = '1rem';
  }

  function updateNotesCharacterCount() {
    if (!inputs.notesCharacterCount) return;
    const characterCount = inputs.notesValue?.value.length || 0;
    inputs.notesCharacterCount.textContent = `${characterCount} ${characterCount === 1 ? 'character' : 'characters'}`;
  }

  // =====================================================================
  // CATEGORY CASCADING + QUALI CODE
  // =====================================================================
  function updateCategoryOptions() {
    const serviceText = getDisplayValue(inputs.serviceTypeSelect);
    const category = inputs.categorySelect;
    if (!category) return;

    if (!serviceText || serviceText === 'Others') {
      category.disabled = true;
      category.innerHTML = '<option selected></option>';
      return;
    }

    category.disabled = false;
    const selectedCategory = category.value;
    const categoryNames = CATEGORY_BY_SERVICE[serviceText] || [];
    populateOptionsList(category, categoryNames.map((name) => ({ value: name, text: name })));
    if (categoryNames.includes(selectedCategory)) category.value = selectedCategory;
  }

  function updateQualiCode() {
    if (!inputs.qualiCodeInput) return;
    const key = [
      getDisplayValue(inputs.serviceTypeSelect),
      getDisplayValue(inputs.categorySelect),
      getDisplayValue(inputs.accountTypeSelect),
    ].join('|');

    inputs.qualiCodeInput.value = QUALI_CODE_BY_COMBO[key] || '';
  }

  // =====================================================================
  // NOTES GENERATION
  // "Customer" and "Customer Others" merge into a single line joined by " - "
  // =====================================================================
  function generateNotes() {
    const fields = [
      ['customerSelect', 'C'], ['databaseCleanupSelect', 'DB'],
      ['newMobileNumberInput', 'NM'], ['newEmailAddressInput', 'NE'],
      ['accountTypeSelect', 'Acct'], ['serviceTypeSelect', 'Svc'], ['categorySelect', 'Cat'], 
      ['resolutionSelect', 'Res'], ['upsellSelect', 'U'], ['ticketNumberInput', 'IRN'], ['qualiCodeInput', 'QC'],
    ];

    // Fields whose value should be appended to another field's line (joined with " - ")
    const mergeIntoMap = {
      customerOthersInput: 'customerSelect',
      serviceOthersInput: 'serviceTypeSelect',
    };

    const lineByKey = {};

    fields.forEach(([key, label]) => {
      const value = getDisplayValue(inputs[key]);
      if (value) lineByKey[key] = `${label}: ${value}`;
    });

    Object.entries(mergeIntoMap).forEach(([childKey, parentKey]) => {
      const childValue = getDisplayValue(inputs[childKey]);
      if (!childValue) return;
      lineByKey[parentKey] = lineByKey[parentKey] ? `${lineByKey[parentKey]} - ${childValue}` : childValue;
    });

    const hiddenPreviewFields = new Set(['accountTypeSelect', 'serviceTypeSelect', 'categorySelect']);
    const generatedNotes = fields
      .filter(([key]) => !hiddenPreviewFields.has(key))
      .map(([key]) => lineByKey[key])
      .filter(Boolean);

    if (inputs.notesValue) {
      inputs.notesValue.value = generatedNotes.length ? generatedNotes.join('\n') : '';
      styleNotesArea();
    }
    updateNotesCharacterCount();
  }

  window.generateNotes = generateNotes;

  // Generic listener for every field (covers text inputs + plain selects)
  Object.keys(inputs).forEach((key) => {
    const field = inputs[key];
    if (!field || key === 'notesValue') return;
    field.addEventListener(field.tagName === 'SELECT' ? 'change' : 'input', generateNotes);
  });

  // =====================================================================
  // SERVICE TYPE -> CATEGORY / QUALI CODE WIRING
  // =====================================================================
  function updateServiceTypeForAccount() {
    const accountText = getDisplayValue(inputs.accountTypeSelect);
    const service = inputs.serviceTypeSelect;
    if (!service) return;

    const isOttAccount = [
      'Cignal Play',
      'Pilipinas Live',
      'Other OTTs - HBO/Disney/Hayu',
    ].includes(accountText);
    const ottOption = Array.from(service.options).find((option) => option.text.trim() === 'OTT');
    const othersOption = Array.from(service.options).find((option) => option.text.trim() === 'Others');

    if (ottOption) {
      ottOption.hidden = !isOttAccount;
    }
    if (othersOption) {
      othersOption.hidden = isOttAccount;
    }

    if (isOttAccount) {
      if (ottOption) service.value = ottOption.value;
      if (inputs.serviceOthersInput) inputs.serviceOthersInput.value = '';
      service.disabled = true;
    } else {
      if (ottOption && service.value === ottOption.value) service.value = '';
      service.disabled = false;
    }
  }

  if (inputs.serviceTypeSelect) {
    inputs.serviceTypeSelect.addEventListener('change', () => {
      if (inputs.categorySelect) inputs.categorySelect.value = '';
      if (inputs.qualiCodeInput) inputs.qualiCodeInput.value = '';

      window.updateServiceOthers?.();
      updateCategoryOptions();
      updateQualiCode();
      generateNotes();
    });
  }

  if (inputs.categorySelect) {
    inputs.categorySelect.addEventListener('change', () => {
      updateQualiCode();
      generateNotes();
    });
  }

  if (inputs.accountTypeSelect) {
    inputs.accountTypeSelect.addEventListener('change', () => {
      const previousService = inputs.serviceTypeSelect?.value;
      updateServiceTypeForAccount();
      window.updateServiceOthers?.();
      const serviceChanged = previousService !== inputs.serviceTypeSelect?.value;
      if (serviceChanged && inputs.categorySelect) inputs.categorySelect.value = '';
      if (inputs.qualiCodeInput) inputs.qualiCodeInput.value = '';
      updateCategoryOptions();
      updateQualiCode();
      generateNotes();
    });
  }

  // =====================================================================
  // SERVICE TYPE "OTHERS" CONDITIONAL FIELD
  // =====================================================================
  const service = inputs.serviceTypeSelect;
  const serviceOthersRow = document.getElementById('serviceOthersRow');
  const serviceDropdownCol = document.getElementById('serviceDropdownCol');
  if (service && serviceOthersRow) {
    const updateServiceOthers = () => {
      const visible = getDisplayValue(service) === 'Others';
      serviceOthersRow.style.display = visible ? 'flex' : 'none';
      if (inputs.serviceOthersInput) {
        inputs.serviceOthersInput.required = visible;
        if (!visible) inputs.serviceOthersInput.value = '';
      }
      if (serviceDropdownCol) {
        serviceDropdownCol.classList.toggle('col-lg-4', visible);
        serviceDropdownCol.classList.toggle('col-lg-9', !visible);
      }
      generateNotes();
    };
    window.updateServiceOthers = updateServiceOthers;
    service.addEventListener('change', updateServiceOthers);
    updateServiceOthers();
  }

  // =====================================================================
  // CUSTOMER "OTHERS" CONDITIONAL FIELD
  // =====================================================================
  const customer = inputs.customerSelect;
  const customerOthersRow = document.getElementById('customerOthersRow');
  const customerDropdownCol = document.getElementById('customerDropdownCol');
  if (customer && customerOthersRow) {
    const updateCustomerOthers = () => {
      const visible = customer.value === '4' || customer.value === '5';
      customerOthersRow.style.display = visible ? 'flex' : 'none';
      if (inputs.customerOthersInput) {
        inputs.customerOthersInput.required = visible;
        if (!visible) inputs.customerOthersInput.value = '';
      }
      if (customerDropdownCol) {
        customerDropdownCol.classList.toggle('col-lg-4', visible);
        customerDropdownCol.classList.toggle('col-lg-9', !visible);
      }
      generateNotes();
    };
    customer.addEventListener('change', updateCustomerOthers);
    updateCustomerOthers();
  }

  // =====================================================================
  // DATABASE CLEAN-UP CONDITIONAL FIELDS
  // =====================================================================
  const cleanup = inputs.databaseCleanupSelect;
  const updatedFieldsRow = document.getElementById('updatedFieldsRow');
  const mobileCol = document.getElementById('newMobileNumberCol');
  const emailCol = document.getElementById('newEmailAddressCol');
  if (cleanup && updatedFieldsRow && mobileCol && emailCol) {
    const updateCleanupFields = () => {
      const showMobile = cleanup.value === '2' || cleanup.value === '4';
      const showEmail = cleanup.value === '3' || cleanup.value === '4';
      updatedFieldsRow.style.display = showMobile || showEmail ? 'flex' : 'none';
      mobileCol.style.display = showMobile ? 'block' : 'none';
      emailCol.style.display = showEmail ? 'block' : 'none';

      if (inputs.newMobileNumberInput) {
        inputs.newMobileNumberInput.required = showMobile;
        if (!showMobile) inputs.newMobileNumberInput.value = '';
      }
      if (inputs.newEmailAddressInput) {
        inputs.newEmailAddressInput.required = showEmail;
        if (!showEmail) {
          inputs.newEmailAddressInput.value = '';
          inputs.newEmailAddressInput.classList.remove('is-invalid');
        }
      }

      generateNotes();
    };
    cleanup.addEventListener('change', updateCleanupFields);
    updateCleanupFields();
  }

  // =====================================================================
  // RESET BUTTON
  // =====================================================================
  const resetButton = document.getElementById('resetBtn');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      Object.keys(inputs).forEach((key) => {
        if (key !== 'notesValue' && inputs[key]) inputs[key].value = '';
      });
      if (customer) customer.dispatchEvent(new Event('change'));
      if (cleanup) cleanup.dispatchEvent(new Event('change'));
      updateServiceTypeForAccount();
      window.updateServiceOthers?.();
      updateCategoryOptions();
      updateQualiCode();
      generateNotes();
    });
  }

  // =====================================================================
  // NOTIFICATION HELPER
  // =====================================================================
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    notification.setAttribute('role', 'alert');
    notification.textContent = message;
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  // =====================================================================
  // COPY BUTTONS
  // =====================================================================
  function highlightCopiedRange(start, end) {
    if (!inputs.notesValue) return;
    inputs.notesValue.focus();
    inputs.notesValue.setSelectionRange(start, end);
  }

  const copyFullButton = document.getElementById('copyFullBtn');
  if (copyFullButton) {
    copyFullButton.addEventListener('click', (event) => {
      event.preventDefault();
      const value = inputs.notesValue?.value.trim();
      if (!value) return showNotification('Nothing to copy', 'warning');
      const start = inputs.notesValue.value.indexOf(value);
      highlightCopiedRange(start, start + value.length);
      navigator.clipboard.writeText(value)
        .then(() => {
          highlightCopiedRange(start, start + value.length);
          showNotification('Copied to clipboard (Full)', 'success');
        })
        .catch(() => showNotification('Failed to copy to clipboard', 'error'));
    });
  }

  [1, 2, 3].forEach((partNumber) => {
    const button = document.getElementById(`copyPart${partNumber}`);
    if (!button) return;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const start = (partNumber - 1) * 256;
      const end = partNumber * 256;
      const value = inputs.notesValue?.value.slice(start, end);
      if (!value) return showNotification(`Part ${partNumber} is empty`, 'warning');
      const selectedEnd = Math.min(end, inputs.notesValue.value.length);
      highlightCopiedRange(start, selectedEnd);
      navigator.clipboard.writeText(value)
        .then(() => {
          highlightCopiedRange(start, selectedEnd);
          showNotification(`Copied to clipboard (Part ${partNumber})`, 'success');
        })
        .catch(() => showNotification('Failed to copy to clipboard', 'error'));
    });
  });

  // =====================================================================
  // INITIAL STATE ON PAGE LOAD
  // =====================================================================
  updateServiceTypeForAccount();
  window.updateServiceOthers?.();
  updateCategoryOptions();
  updateQualiCode();
})();