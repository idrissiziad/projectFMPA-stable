#!/usr/bin/env node

// Test script for the new API endpoints
const fetch = require('node-fetch');

async function testAPIs() {
  console.log('Testing ProjectFMPA API endpoints...\n');
  
  try {
    // Test 1: Get available years
    console.log('1. Testing /api/years...');
    const yearsResponse = await fetch('http://localhost:3000/api/years');
    const yearsData = await yearsResponse.json();
    console.log('✓ Years API working');
    console.log('Available years:', yearsData.years);
    console.log('');
    
    // Test 2: Get all files
    console.log('2. Testing /api/files...');
    const filesResponse = await fetch('http://localhost:3000/api/files');
    const filesData = await filesResponse.json();
    console.log('✓ Files API working');
    console.log('Total files:', filesData.files.length);
    console.log('');
    
    // Test 3: Get files by year (if years are available)
    if (yearsData.years.length > 0) {
      const testYear = yearsData.years[0];
      console.log(`3. Testing /api/files-by-year/${testYear}...`);
      const yearFilesResponse = await fetch(`http://localhost:3000/api/files-by-year/${testYear}`);
      const yearFilesData = await yearFilesResponse.json();
      console.log('✓ Files by year API working');
      console.log(`Files for year ${testYear}:`, yearFilesData.files.length);
      console.log('');
    }
    
    // Test 4: Search files
    console.log('4. Testing /api/search-files/medecine...');
    const searchResponse = await fetch('http://localhost:3000/api/search-files/medecine');
    const searchData = await searchResponse.json();
    console.log('✓ Search API working');
    console.log('Search results:', searchData.files.length);
    console.log('');
    
    console.log('🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPIs();