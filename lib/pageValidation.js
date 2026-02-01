import { adventurePages } from '../app/adventure/pages';

/**
 * Validates if a page exists in the adventure pages
 * @param {string} pageId - The page ID to validate
 * @returns {boolean} - True if page exists, false otherwise
 */
export function isValidPage(pageId) {
  return pageId && adventurePages.hasOwnProperty(pageId);
}

/**
 * Gets a safe page ID, defaulting to page_1 if invalid
 * @param {string} pageId - The page ID to validate
 * @returns {string} - Valid page ID
 */
export function getSafePageId(pageId) {
  if (isValidPage(pageId)) {
    return pageId;
  }
  console.warn(`Invalid page ID: ${pageId}, defaulting to page_1`);
  return 'page_1';
}

/**
 * Validates all next page references in a page object
 * @param {object} page - The page object to validate
 * @returns {object} - Validation results with errors array
 */
export function validatePageReferences(page) {
  const errors = [];
  
  if (!page) {
    return { valid: false, errors: ['Page is null or undefined'] };
  }
  
  // Check direct next
  if (page.next && !isValidPage(page.next)) {
    errors.push(`Invalid next page: ${page.next}`);
  }
  
  // Check choices
  if (page.choices) {
    page.choices.forEach((choice, index) => {
      if (choice.next && !isValidPage(choice.next)) {
        errors.push(`Invalid choice ${index} next page: ${choice.next}`);
      }
    });
  }
  
  // Check conditional next
  if (page.conditionalNext) {
    page.conditionalNext.forEach((branch, index) => {
      if (branch.next && !isValidPage(branch.next)) {
        errors.push(`Invalid conditional branch ${index} next page: ${branch.next}`);
      }
    });
  }
  
  // Check class redirects
  if (page.classNext) {
    Object.entries(page.classNext).forEach(([className, routes]) => {
      Object.entries(routes).forEach(([route, pageId]) => {
        if (pageId && !isValidPage(pageId)) {
          errors.push(`Invalid classNext[${className}][${route}]: ${pageId}`);
        }
      });
    });
  }
  
  // Check input next
  if (page.input?.next && !isValidPage(page.input.next)) {
    errors.push(`Invalid input next page: ${page.input.next}`);
  }
  
  // Check roll success/fail pages
  if (page.roll) {
    if (page.roll.nextSuccess && !isValidPage(page.roll.nextSuccess)) {
      errors.push(`Invalid roll success page: ${page.roll.nextSuccess}`);
    }
    if (page.roll.nextFail && !isValidPage(page.roll.nextFail)) {
      errors.push(`Invalid roll fail page: ${page.roll.nextFail}`);
    }
  }
  
  // Check battle pages
  if (page.fail && !isValidPage(page.fail)) {
    errors.push(`Invalid fail page: ${page.fail}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates all pages in the adventure
 * @returns {object} - Validation report
 */
export function validateAllPages() {
  const report = {
    totalPages: 0,
    validPages: 0,
    invalidPages: [],
    allErrors: []
  };
  
  Object.entries(adventurePages).forEach(([pageId, page]) => {
    report.totalPages++;
    const validation = validatePageReferences(page);
    
    if (validation.valid) {
      report.validPages++;
    } else {
      report.invalidPages.push({
        pageId,
        errors: validation.errors
      });
      report.allErrors.push(...validation.errors.map(err => `${pageId}: ${err}`));
    }
  });
  
  return report;
}

/**
 * Logs validation report to console
 */
export function logValidationReport() {
  const report = validateAllPages();
  
  console.log('=== Page Validation Report ===');
  console.log(`Total Pages: ${report.totalPages}`);
  console.log(`Valid Pages: ${report.validPages}`);
  console.log(`Invalid Pages: ${report.invalidPages.length}`);
  
  if (report.invalidPages.length > 0) {
    console.warn('\nInvalid Page References:');
    report.invalidPages.forEach(({ pageId, errors }) => {
      console.warn(`\n${pageId}:`);
      errors.forEach(err => console.warn(`  - ${err}`));
    });
  } else {
    console.log('\n All page references are valid!');
  }
  
  return report;
}