import { Box, Typography, Stack } from '@mui/material';
import PropTypes from 'prop-types';

const SectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  gutterBottom = true,
  sx = {}
}) => {
  return (
    <Box
      sx={{
        mb: gutterBottom ? 3 : 0,
        ...sx
      }}
    >
      <Stack spacing={subtitle ? 1 : 0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {Icon && (
              <Icon
                sx={{
                  color: 'primary.main',
                  fontSize: 24
                }}
              />
            )}
            <Typography
              variant="h2"
              sx={{
                color: 'text.primary',
                fontSize: {
                  xs: '20px',
                  sm: '24px'
                }
              }}
            >
              {title}
            </Typography>
          </Stack>
          {action && <Box>{action}</Box>}
        </Stack>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              maxWidth: '60ch',
              lineHeight: 1.6
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  action: PropTypes.node,
  gutterBottom: PropTypes.bool,
  sx: PropTypes.object
};

export default SectionHeader;
