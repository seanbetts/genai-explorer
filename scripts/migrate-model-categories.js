/**
 * Script to migrate company categories to model categories
 * 
 * This script will:
 * 1. Load the landscape.json file
 * 2. Add a category field to each model based on company category and model properties
 * 3. Remove the category field from companies
 * 4. Save the updated landscape.json file
 * 
 * Run with: node scripts/migrate-model-categories.js
 */

const fs = require('fs');
const path = require('path');

// Path to landscape data file
const dataPath = path.join(__dirname, '..', 'data', 'landscape.json');

// CompanyCategory type equivalent in JavaScript
const CompanyCategories = ['frontier', 'open', 'enterprise', 'image', 'video', 'music', 'other'];

/**
 * Determines the category of a model based on its properties and company category
 */
function deriveModelCategory(model, companyCategory) {
  // Check model properties to derive category
  if (model.specs?.openSource) {
    return 'open';
  }
  
  // Add rules based on model characteristics
  if (model.type === 'image' || model.specs?.outputFormats?.includes('image')) {
    return 'image';
  }
  
  if (model.type === 'video' || model.specs?.outputFormats?.includes('video')) {
    return 'video';
  }
  
  if (model.type === 'music' || model.specs?.outputFormats?.includes('audio')) {
    return 'music';
  }
  
  // Fall back to company category if valid, otherwise use enterprise
  if (CompanyCategories.includes(companyCategory)) {
    return companyCategory;
  }
  
  // Default to frontier for leading models or enterprise as fallback
  if (model.capabilities?.intelligence && model.capabilities.intelligence >= 4) {
    return 'frontier';
  }
  
  return 'enterprise';
}

// Main migration function
async function migrateCategories() {
  try {
    // Load landscape data
    const landscapeData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Create backup
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', 'landscape.backup.json'), 
      JSON.stringify(landscapeData, null, 2)
    );
    
    console.log('Created backup at data/landscape.backup.json');
    
    // Process each company
    landscapeData.companies.forEach(company => {
      const companyCategory = company.category;
      
      // Add category to each model
      company.models.forEach(model => {
        model.category = deriveModelCategory(model, companyCategory);
      });
      
      // Remove category from company
      delete company.category;
    });
    
    // Save updated data
    fs.writeFileSync(
      dataPath, 
      JSON.stringify(landscapeData, null, 2)
    );
    
    console.log('Successfully migrated model categories!');
    console.log('- Added category field to each model');
    console.log('- Removed category field from companies');
    
    // Print statistics
    const totalModels = landscapeData.companies.reduce(
      (sum, company) => sum + company.models.length, 
      0
    );
    
    const categoryCounts = landscapeData.companies.reduce((counts, company) => {
      company.models.forEach(model => {
        counts[model.category] = (counts[model.category] || 0) + 1;
      });
      return counts;
    }, {});
    
    console.log(`\nTotal models processed: ${totalModels}`);
    console.log('\nModels by category:');
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} models (${Math.round(count / totalModels * 100)}%)`);
      });
    
  } catch (error) {
    console.error('Error migrating categories:', error);
    process.exit(1);
  }
}

// Run migration
migrateCategories();