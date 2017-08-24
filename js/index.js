var chartData = {
  score: 72, // always holds the user's most recently calculated medean score
  currentScore: 72, // user's medean score for the currently selected date range and/or applied filters
  fixedScore: 32, // user's score for fixed-expense factors (changes with selected dates/filters)
  flexibleScore: 10, // user's score for flexible-spending factors (changes with selected dates/filters)
  savingsScore: 18, // user's score for networth/savings factors (changes with selected dates/filters)
};

var chart = new ScoreChart(chartData)
  .renderTo('#score-chart');
