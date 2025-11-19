
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  useTheme, 
  Stack, 
  Chip, 
  List, 
  Skeleton 
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Cancel as CancelIcon, 
  PersonOutline as UserIcon 
} from '@mui/icons-material';


interface LoginLogsDrawerProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
}


const mockLoginAttempts = [
  { id: 1, name: 'John Doe', email: 'john.doe@company.com', status: 'success', time: 'Jan 15, 02:30 PM', ip: '192.168.1.100', reason: '' },
  { id: 2, name: 'Unknown User', email: 'hacker@example.com', status: 'failed', time: 'Jan 15, 10:20 AM', ip: '203.0.113.45', reason: 'Account locked' },
  { id: 3, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', status: 'success', time: 'Jan 15, 09:15 AM', ip: '192.168.1.101', reason: '' },
  { id: 4, name: 'Mike Chen', email: 'mike.chen@company.com', status: 'success', time: 'Jan 15, 08:45 AM', ip: '192.168.1.102', reason: '' },
  { id: 5, name: 'Unknown User', email: 'test@test.com', status: 'failed', time: 'Jan 14, 11:30 PM', ip: '198.51.100.23', reason: 'Account locked' },
  { id: 6, name: 'John Doe', email: 'john.doe@company.com', status: 'success', time: 'Jan 15, 02:30 PM', ip: '192.168.1.100', reason: '' },
];


// ==============================|| LOGS LIST ITEM - INNER COMPONENT ||============================== //

const LogListItem = ({ log }: { log: typeof mockLoginAttempts[0] }) => {
  const theme = useTheme();
  const isSuccessful = log.status === 'success';

  const colors = isSuccessful
    ? { main: theme.palette.success.main, lighter: theme.palette.success.light}
    : { main: theme.palette.error.main, lighter: theme.palette.error.light };

  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper, 
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[0], 
        transition: 'box-shadow 0.3s',
        '&:hover': {
            boxShadow: theme.shadows[3],
        }
      }}
    >
        
      <Stack direction="row" spacing={2} alignItems="flex-start"> 
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: colors.lighter, 
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {isSuccessful ? (
            <UserIcon sx={{ color: colors.main, fontSize: 18 }} />
          ) : (
            <CancelIcon sx={{ color: colors.main, fontSize: 18 }} />
          )}
        </Box>

        
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            
           
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 0.5, columnGap: 1 }}
            >
                <Typography variant="body1" fontWeight={600}>
                    {log.name}
                </Typography>
                <Chip
                  label={isSuccessful ? "Success" : "Failed"}
                  size="small"
                  sx={{
                    bgcolor: colors.lighter,
                    color: colors.main,
                    fontWeight: 600,
                    borderRadius: '10 px',
                    height: '22px',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}
                />
            </Stack>

            {/* Row 2: Email and IP Address */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 0.5 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ wordBreak: 'break-word' }}
              >
                {log.email}
              </Typography>
            </Stack>

            {/* Row 3: Time and Reason (Only for Failed) */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ rowGap: 0.25, columnGap: 1, flexWrap: 'wrap' }}
            >
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  Time:
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 0.5, wordBreak: 'break-word' }}
                >
                  {log.time}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" fontWeight={600} color="text.primary">
                  IP Address:
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 0.5, wordBreak: 'break-all' }}
                >
                  {log.ip}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 0.25 }}>
              {!isSuccessful && log.reason && (
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color={theme.palette.error.dark}
                  >
                    Reason:
                  </Typography>
                  <Typography
                    variant="caption"
                    color={theme.palette.error.dark}
                    sx={{ ml: 0.5, wordBreak: 'break-word' }}
                  >
                    {log.reason}
                  </Typography>
                </Box>
              )}
            </Stack>

        </Box>
      </Stack>
    </Box>
  );
};


// ==============================|| SKELETON LOADER ||============================== //

const LogListSkeleton = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                p: 2,
                mb: 2, 
                borderRadius: 2, 
                backgroundColor: theme.palette.background.paper, 
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[0], 
            }}
        >
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Skeleton variant="circular" width={32} height={32} sx={{ mt: 0.25 }} />
                <Box sx={{ flexGrow: 1 }}>
                    
                    {/* Row 1: Name and Chip */}
                    <Stack direction="row" justifyContent="space-between">
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '10px' }} />
                    </Stack>
                    
                    {/* Row 2: Email */}
                    <Stack direction="row" justifyContent="flex-start" sx={{ mt: 0.5 }}>
                        <Skeleton variant="text" width="60%" height={15} />
                    </Stack>
                    
                    {/* Row 3: Time and IP Address (Side-by-side) */}
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                        <Skeleton variant="text" width="35%" height={15} /> {/* For Time */}
                        <Skeleton variant="text" width="45%" height={15} /> {/* For IP Address */}
                    </Stack>
                    
                    {/* Row 4: Reason (Only renders when failed, so we'll optionally include a small one) */}
                    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 0.5 }}>
                        <Skeleton variant="text" width="50%" height={15} />
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};


// ==============================|| MAIN DRAWER COMPONENT ||============================== //

const LoginLogsDrawer = ({ open, onClose, loading }: LoginLogsDrawerProps) => {
  const theme = useTheme();
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 560 }, 
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* DRAWER CONTAINER: Defines flex column layout */}
      <Box 
        sx={{ 
          width: "100%", 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          backgroundColor: theme.palette.background.default 
        }}
      >
     
        {/* FIXED HEADER SECTION */}
        <Box 
          sx={{ 
            p: 3,
            backgroundColor: theme.palette.background.paper, 
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
                  <Box>
              <Typography variant="h4" fontWeight={600}>
                Login attempts
              </Typography>
              <Typography variant="body2" color="text.secondary">
               Recent successful and failed attempts
              </Typography>
            </Box>

                <Typography>

                </Typography>
            </Stack>

            <IconButton
              size="large"
              onClick={onClose}
              aria-label="close login logs"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
                
        <Box 
          sx={{ 
            flex: 1, 
            overflowY: "auto", 
            p: 3,
          }}
        >
          <List sx={{ p: 0 }}>
              
            {loading ? (
                
                <>
                    <LogListSkeleton />
                    <LogListSkeleton />
                    <LogListSkeleton />
                    <LogListSkeleton />
                </>
            ) : (
              
                mockLoginAttempts.map((log) => (
                    <LogListItem key={log.id} log={log} />
                ))
            )}
            
            {/* No Activities Message */}
            {!loading && mockLoginAttempts.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No login attempts found in the specified period.
                </Typography>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default LoginLogsDrawer;