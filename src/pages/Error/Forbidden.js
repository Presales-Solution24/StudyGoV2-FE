import { Link } from "react-router-dom";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

function Forbidden() {
  return (
    <MKBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={2}
    >
      <MKTypography variant="h1" color="warning" fontWeight="bold">
        403
      </MKTypography>
      <MKTypography variant="h4" mt={2} mb={2}>
        Access Forbidden
      </MKTypography>
      <MKTypography variant="body1" mb={4}>
        You don&apos;t have permission to access this page.
      </MKTypography>
      <MKButton component={Link} to="/" variant="gradient" color="info">
        Go to Home
      </MKButton>
    </MKBox>
  );
}

export default Forbidden;
