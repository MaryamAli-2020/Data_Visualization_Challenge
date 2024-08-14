import fetch from 'node-fetch'; // Ensure you have node-fetch installed: npm install node-fetch

const apiUrl = 'https://data.ajman.ae/api/explore/v2.1/catalog/datasets/number-of-graduates-in-higher-education-aj1/records';
const queryParams = {
    limit: -1,
    order_by: 'academic_year'
};

async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}?${new URLSearchParams(queryParams)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Expected JSON response from server');
        }

        const data = await response.json();
        return data; // Return the fetched JSON data
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to handle it later
    }
}

// Invoke the fetchData function to fetch and output the data
fetchData()
  .then(data => {
    process.stdout.write(JSON.stringify(data));
  })
  .catch(error => {
    console.error('Error in data loader:', error);
    process.exit(1); // Exit with error code if fetching fails
  });
