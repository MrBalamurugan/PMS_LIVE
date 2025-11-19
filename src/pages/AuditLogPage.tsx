// material-ui
import { Stack, Typography } from "@mui/material";
import AuditLogsTable from "./AuditLogsTable";

// project import

// ==============================|| SAMPLE PAGE ||============================== //

const AuditLogPage = () => (
  <>
    {/* 🔹 Title Section OUTSIDE MainCard */}
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ pt: 0, pb: 0, mb: 3 }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Audit Logs
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          View and monitor all audit log activities
        </Typography>
      </Stack>
    </Stack>
    {/* <MainCard> */}
    <AuditLogsTable />
    {/* </MainCard> */}
  </>
);

export default AuditLogPage;
