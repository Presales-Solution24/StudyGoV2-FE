import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Users() {
  return (
    <MKBox py={3}>
      <MKTypography variant="h4" fontWeight="bold" mb={2}>
        Users
      </MKTypography>
      <MKTypography variant="body1">Manage your users here.</MKTypography>
    </MKBox>
  );
}

export default Users;
