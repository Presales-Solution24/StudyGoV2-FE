import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Dashboard() {
  return (
    <MKBox py={3}>
      <MKTypography variant="h4" fontWeight="bold" mb={2}>
        Dashboard
      </MKTypography>
      <MKTypography variant="body1">Welcome to Admin Dashboard!</MKTypography>
    </MKBox>
  );
}

export default Dashboard;
