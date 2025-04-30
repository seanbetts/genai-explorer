import { Company, Model, CompanyCategory, CategorizedCompanies } from '../types';

/**
 * Gets a hash map of companies by category based on their models
 * This allows for companies to appear in multiple categories if they have models in those categories
 */
export const getCompaniesByModelCategory = (companies: Company[]): CategorizedCompanies => {
  const categorizedCompanies: CategorizedCompanies = {
    frontier: [],
    open: [],
    enterprise: [],
    image: [],
    video: [],
    audio: [],
    other: []
  };
  
  // Track companies already added to a category to avoid duplicates
  const addedCompanies: Record<string, Set<CompanyCategory>> = {};
  
  // Helper to safely add a company to a category
  const addCompanyToCategory = (company: Company, category: CompanyCategory) => {
    // Initialize the set if it doesn't exist
    if (!addedCompanies[company.id]) {
      addedCompanies[company.id] = new Set();
    }
    
    // If this company hasn't been added to this category yet, add it
    if (!addedCompanies[company.id].has(category)) {
      categorizedCompanies[category].push({
        ...company,
        // Filter models to only include those matching this category
        models: company.models.filter(model => 
          model.category === category && model.status !== 'archived'
        )
      });
      
      // Mark this company as added to this category
      addedCompanies[company.id].add(category);
    }
  };
  
  // Process each company
  companies.forEach(company => {
    // Group by model categories
    company.models.forEach(model => {
      if (model.status !== 'archived' && model.category) {
        addCompanyToCategory(company, model.category);
      }
    });
  });
  
  return categorizedCompanies;
};

/**
 * Helper to check if a company has at least one primary model 
 */
export const hasPrimaryModel = (company: Company): boolean => {
  return company.models && company.models.some(model => model.status === 'primary');
};

/**
 * Get companies that have at least one model in the specified category
 */
export const getCompaniesWithModelInCategory = (
  companies: Company[],
  category: CompanyCategory,
  primaryOnly: boolean = true
): Company[] => {
  return companies.filter(company => {
    const hasModelInCategory = company.models?.some(model => 
      model.category === category && 
      (!primaryOnly || model.status === 'primary')
    );
    return hasModelInCategory;
  });
};