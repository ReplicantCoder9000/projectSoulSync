import { Box, Grid, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CardContainer from '../ui/CardContainer';
import SectionHeader from '../ui/SectionHeader';

const MOOD_COLORS = {
  happy: '#FFD700',    // Gold
  peaceful: '#98FB98', // Pale Green
  excited: '#FF69B4',  // Hot Pink
  neutral: '#B0C4DE',  // Light Steel Blue
  anxious: '#DDA0DD',  // Plum
  sad: '#87CEEB',      // Sky Blue
  angry: '#FF6B6B'     // Light Red
};

const MoodStats = ({ entries }) => {
  // Process entries to get mood distribution
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count
  }));

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ 
          fontSize: '12px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <CardContainer>
      <SectionHeader
        title="Mood Distribution"
        subtitle="Your emotional journey at a glance"
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {entries.length > 0 ? (
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={MOOD_COLORS[entry.name.toLowerCase()]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                py: 6,
                bgcolor: 'background.default',
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography>
                Start journaling to see your mood distribution!
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </CardContainer>
  );
};

export default MoodStats;
