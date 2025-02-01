import { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme
} from '@mui/material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { InsertChart as ChartIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import CardContainer from '../ui/CardContainer';
import SectionHeader from '../ui/SectionHeader';

const timeRanges = [
  { value: '7days', label: 'Week' },
  { value: '30days', label: 'Month' },
  { value: '90days', label: '3 Months' }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <CardContainer
        sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          boxShadow: (theme) => theme.shadows.strong,
          minWidth: 120
        }}
      >
        <Stack spacing={0.5}>
          <Box sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {label}
          </Box>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{
                color: 'text.primary',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              {entry.name}: {entry.value}
            </Box>
          ))}
        </Stack>
      </CardContainer>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string
};

const MoodStats = ({ entries }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7days');

  const moodColors = theme.palette.mood;

  const handleTimeRangeChange = (_, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const cutoff = new Date(now.setDate(now.getDate() - days));
    
    return entries.filter(entry => new Date(entry.date) >= cutoff);
  }, [entries, timeRange]);

  const moodDistribution = useMemo(() => {
    const distribution = {};
    filteredEntries.forEach(entry => {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count
    }));
  }, [filteredEntries]);

  const moodTrends = useMemo(() => {
    const trends = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!trends[date]) {
        trends[date] = { date, count: 0 };
      }
      trends[date].count++;
    });
    
    return Object.values(trends).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [filteredEntries]);

  return (
    <CardContainer>
      <Stack spacing={3}>
        <SectionHeader
          title="Mood Analytics"
          icon={ChartIcon}
          action={
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    }
                  }
                }
              }}
            >
              {timeRanges.map(range => (
                <ToggleButton key={range.value} value={range.value}>
                  {range.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          }
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
            gap: 4
          }}
        >
          {/* Mood Distribution */}
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={moodColors[entry.name.toLowerCase()]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Entry Frequency */}
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={moodTrends}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                  stroke={theme.palette.text.secondary}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={theme.palette.text.secondary}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: theme.palette.primary.main,
                    strokeWidth: 2,
                    stroke: theme.palette.background.paper
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Stack>
    </CardContainer>
  );
};

MoodStats.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      mood: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MoodStats;
