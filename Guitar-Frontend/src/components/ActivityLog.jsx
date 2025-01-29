// import {
//   AccessTime as AccessTimeIcon,
//   CheckCircle as CheckCircleIcon,
//   Code as CodeIcon,
//   Computer as ComputerIcon,
//   Error as ErrorIcon,
//   Language as LanguageIcon,
//   Person as PersonIcon,
//   Router as RouterIcon,
// } from "@mui/icons-material";
// import {
//   Avatar,
//   Box,
//   Chip,
//   CircularProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import React, { useEffect, useState } from "react";
// import { activitylogs } from "../Apis/api";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   fontWeight: 600,
//   textTransform: "uppercase",
//   fontSize: "0.75rem",
//   color: theme.palette.text.secondary,
// }));

// const GradientTypography = styled(Typography)(({ theme }) => ({
//   background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//   backgroundClip: "text",
//   WebkitBackgroundClip: "text",
//   color: "transparent",
//   fontWeight: "bold",
// }));

// const ActivityLog = () => {
//   const [logs, setLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const theme = useTheme();

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const fetchedLogs = await activitylogs();
//         setLogs(fetchedLogs.data.logs);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch activity logs:", error);
//         setIsLoading(false);
//       }
//     };
//     fetchLogs();
//   }, []);

//   const getMethodColor = (method) => {
//     const colors = {
//       GET: "info",
//       POST: "success",
//       PUT: "warning",
//       DELETE: "error",
//     };
//     return colors[method] || "default";
//   };

//   const getStatusColor = (status) => {
//     if (status >= 200 && status < 300) return theme.palette.success.main;
//     if (status >= 400) return theme.palette.error.main;
//     return theme.palette.warning.main;
//   };

//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="400px"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ width: "100%", mb: 4 }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 3,
//         }}
//       >
//         <GradientTypography variant="h4">
//           System Activity Logs
//         </GradientTypography>
//         <Typography variant="body2" color="text.secondary">
//           Total Entries: {logs.length}
//         </Typography>
//       </Box>

//       <TableContainer component={Paper} elevation={2}>
//         <Table sx={{ minWidth: 800 }}>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <PersonIcon fontSize="small" />
//                   User
//                 </Box>
//               </StyledTableCell>
//               <StyledTableCell>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <LanguageIcon fontSize="small" />
//                   URL
//                 </Box>
//               </StyledTableCell>
//               <StyledTableCell>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <CodeIcon fontSize="small" />
//                   Method
//                 </Box>
//               </StyledTableCell>
//               <StyledTableCell>Role</StyledTableCell>
//               <StyledTableCell>Status</StyledTableCell>
//               <StyledTableCell>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <AccessTimeIcon fontSize="small" />
//                   Time
//                 </Box>
//               </StyledTableCell>
//               <StyledTableCell>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <ComputerIcon fontSize="small" />
//                   Device
//                 </Box>
//               </StyledTableCell>
//               <StyledTableCell>
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                   <RouterIcon fontSize="small" />
//                   IP Address
//                 </Box>
//               </StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {logs.map((log) => (
//               <TableRow
//                 key={log._id}
//                 sx={{ "&:hover": { backgroundColor: "action.hover" } }}
//               >
//                 <TableCell>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Avatar
//                       sx={{
//                         background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//                       }}
//                     >
//                       {log.username[0].toUpperCase()}
//                     </Avatar>
//                     <Typography variant="body2">{log.username}</Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       maxWidth: 300,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {log.url}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Chip
//                     label={log.method}
//                     color={getMethodColor(log.method)}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Chip label={log.role} color="secondary" size="small" />
//                 </TableCell>
//                 <TableCell>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 0.5,
//                       color: getStatusColor(log.status),
//                     }}
//                   >
//                     {log.status >= 200 && log.status < 300 ? (
//                       <CheckCircleIcon fontSize="small" />
//                     ) : (
//                       <ErrorIcon fontSize="small" />
//                     )}
//                     <Typography variant="body2">{log.status}</Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" color="text.secondary">
//                     {new Date(log.time).toLocaleString()}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" color="text.secondary">
//                     {log.device}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" color="text.secondary">
//                     {log.ipAddress}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default ActivityLog;

import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Computer as ComputerIcon,
  Error as ErrorIcon,
  FilterList as FilterListIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Router as RouterIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { activitylogs } from "../Apis/api";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)",
  overflow: "hidden",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  textTransform: "uppercase",
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transition: "background-color 0.2s ease",
  },
  "&:last-child td": {
    borderBottom: 0,
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 12,
  height: 24,
  fontSize: "0.75rem",
  backgroundColor:
    status >= 200 && status < 300
      ? theme.palette.success.light
      : status >= 400
      ? theme.palette.error.light
      : theme.palette.warning.light,
  color:
    status >= 200 && status < 300
      ? theme.palette.success.dark
      : status >= 400
      ? theme.palette.error.dark
      : theme.palette.warning.dark,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const fetchedLogs = await activitylogs();
        setLogs(fetchedLogs.data.logs);
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [refreshKey]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "info",
      POST: "success",
      PUT: "warning",
      DELETE: "error",
    };
    return colors[method] || "default";
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="400px"
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading activity logs...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "100%" }}>
      <StyledCard>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Stack spacing={1}>
              <GradientTypography variant="h4">
                System Activity Logs
              </GradientTypography>
              <Typography variant="body2" color="text.secondary">
                Monitoring system activities and user interactions
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                icon={<FilterListIcon />}
                label={`${logs.length} Entries`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Tooltip title="Refresh logs">
                <IconButton onClick={handleRefresh} size="small">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      User
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LanguageIcon fontSize="small" />
                      URL
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CodeIcon fontSize="small" />
                      Method
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon fontSize="small" />
                      Time
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ComputerIcon fontSize="small" />
                      Device
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <RouterIcon fontSize="small" />
                      IP Address
                    </Box>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log, index) => (
                    <Fade in={true} timeout={300 + index * 100}>
                      <StyledTableRow key={log._id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              }}
                            >
                              {log.username[0].toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">
                              {log.username}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={log.url} arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {log.url}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.method}
                            color={getMethodColor(log.method)}
                            size="small"
                            sx={{
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.role}
                            color="secondary"
                            size="small"
                            sx={{
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip
                            status={log.status}
                            icon={
                              log.status >= 200 && log.status < 300 ? (
                                <CheckCircleIcon fontSize="small" />
                              ) : (
                                <ErrorIcon fontSize="small" />
                              )
                            }
                            label={log.status}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(log.time).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.device}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.ipAddress}
                          </Typography>
                        </TableCell>
                      </StyledTableRow>
                    </Fade>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={logs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </StyledCard>
    </Box>  
  );
};

export default ActivityLog;
