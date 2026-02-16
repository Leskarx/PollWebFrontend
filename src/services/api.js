// Mock API service for demo purposes
// In production, replace with actual API calls

const mockPolls = new Map();
let pollCounter = 1;

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const createPoll = async (pollData) => {
  await delay(800);

  const pollId = `poll_${pollCounter++}`;
  const poll = {
    pollId,
    question: pollData.question,
    options: pollData.options,
    pollType: pollData.pollType,
    expiry: pollData.expiry,
    results: pollData.options.map(() => ({ votes: 0, percentage: 0 })),
    createdAt: Date.now()
  };

  mockPolls.set(pollId, poll);

  return {
    pollId,
    url: `${window.location.origin}/poll/${pollId}`
  };
};

export const fetchPoll = async (pollId) => {
  await delay(600);

  const poll = mockPolls.get(pollId);
  if (!poll) {
    throw new Error('Poll not found or expired');
  }

  return poll;
};

export const submitVote = async (pollId, selectedOptions) => {
  await delay(500);

  const poll = mockPolls.get(pollId);
  if (!poll) {
    throw new Error('Poll not found');
  }

  // Simulate voting limit (optional)
  const voteCount = poll.results.reduce((sum, r) => sum + r.votes, 0);
  if (voteCount >= 1000) {
    throw new Error('Voting limit reached for this poll');
  }

  // Update vote counts
  selectedOptions.forEach(optionIndex => {
    poll.results[optionIndex].votes += 1;
  });

  // Recalculate percentages
  const totalVotes = poll.results.reduce((sum, r) => sum + r.votes, 0);
  poll.results.forEach(result => {
    result.percentage = totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;
  });

  mockPolls.set(pollId, poll);

  return { success: true };
};

export const subscribeToLiveResults = (pollId, callback) => {
  // Simulate real-time updates with random votes
  const interval = setInterval(() => {
    const poll = mockPolls.get(pollId);
    if (!poll) {
      clearInterval(interval);
      return;
    }

    // Randomly add votes (30% chance every 3 seconds)
    if (Math.random() < 0.3) {
      const randomOptionIndex = Math.floor(Math.random() * poll.options.length);
      poll.results[randomOptionIndex].votes += 1;

      const totalVotes = poll.results.reduce((sum, r) => sum + r.votes, 0);
      poll.results.forEach(result => {
        result.percentage = totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;
      });

      mockPolls.set(pollId, poll);
      callback(poll.results);
    }
  }, 3000);

  return () => clearInterval(interval);
};
