import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  styled,
  keyframes
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Book as JournalIcon,
  BarChart as StatsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth.js';

const drawerWidth = 280;

const scanlineAnimation = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
`;

const RetroDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    borderRight: '2px solid',
    borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
    boxShadow: '4px 0 6px rgba(0, 0, 0, 0.1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: theme.gradients.crt,
      opacity: 0.05,
      pointerEvents: 'none'
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
      backgroundSize: '100% 2px',
      animation: `${scanlineAnimation} 8s linear infinite`,
      opacity: 0.05,
      pointerEvents: 'none'
    }
  }
}));

const RetroAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.gradients.metallic,
  borderBottom: '2px solid',
  borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.5)'
  }
}));

const RetroListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '4px 8px',
  borderRadius: 4,
  border: '2px solid transparent',
  transition: 'all 0.2s ease-in-out',
  background: theme.gradients.metallic,
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'light' ? '#E6E6FA' : '#4A4A4A',
    borderColor: theme.palette.primary.main,
    boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'light' ? '#E6E6FA' : '#4A4A4A'
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    borderColor: theme.palette.secondary.main,
    transform: 'translateY(-1px)'
  }
}));

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: '🗂️ Dashboard', icon: <DashboardIcon />, path: '/dashboard', description: 'View your mood overview' },
    { text: '📝 New Entry', icon: <AddIcon />, path: '/new-entry', description: 'Create a new journal entry' },
    { text: '📂 Journal Entries', icon: <JournalIcon />, path: '/entries', description: 'Browse all entries' },
    { text: '📊 Mood Stats', icon: <StatsIcon />, path: '/stats', description: 'Analyze your mood patterns' },
    { text: '⚙️ Settings', icon: <SettingsIcon />, path: '/settings', description: 'Customize your experience' }
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 2, background: (theme) => theme.gradients.metallic }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              boxShadow: '0 0 4px rgba(255, 20, 147, 0.5)',
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '14px',
              color: 'primary.main',
              textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)'
            }}
          >
            Mood Journal
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            fontFamily: '"VT323", monospace',
            fontSize: '14px',
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          v2.0 Y2K Edition
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <RetroListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                  '& .MuiSvgIcon-root': {
                    filter: location.pathname === item.path ? 'drop-shadow(2px 2px 0 rgba(255, 105, 180, 0.2))' : 'none'
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Box>
                <ListItemText
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{
                    fontFamily: '"VT323", monospace',
                    fontSize: '16px',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary'
                  }}
                  secondaryTypographyProps={{
                    fontFamily: '"VT323", monospace',
                    fontSize: '12px',
                    sx: { opacity: 0.7 }
                  }}
                />
              </Box>
            </RetroListItemButton>
          </ListItem>
        ))}
        <Box sx={{ mt: 2 }}>
          <Divider />
        </Box>
        <ListItem disablePadding sx={{ mt: 2 }}>
          <RetroListItemButton
            onClick={handleLogout}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="🚪 Logout"
              primaryTypographyProps={{
                fontFamily: '"VT323", monospace',
                fontSize: '16px'
              }}
            />
          </RetroListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <RetroAppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              border: '2px solid',
              borderColor: 'grey.300',
              '&:hover': {
                backgroundColor: 'rgba(255, 105, 180, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: 'text.primary',
              fontFamily: '"VT323", monospace',
              fontSize: '20px',
              textShadow: '1px 1px 0 rgba(255, 105, 180, 0.2)'
            }}
          >
            {user?.username ? `Welcome, ${user.username}` : 'Mood Journal'}
          </Typography>
        </Toolbar>
      </RetroAppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <RetroDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </RetroDrawer>
        <RetroDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </RetroDrawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.gradients.crt,
            opacity: 0.02,
            pointerEvents: 'none'
          }
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
