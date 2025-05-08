import { getUserStats } from '../firebaseConfig';

const displayUserStats = async () => {
  try {
    const stats = await getUserStats();
    console.log('\nUser Statistics:');
    console.log('----------------');
    console.log(`Total Users: ${stats.total}`);
    console.log(`Farmers: ${stats.farmers}`);
    console.log(`Buyers: ${stats.buyers}`);
    console.log(`Experts: ${stats.experts}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the function
displayUserStats(); 