
// We need to wrap this component with an import to prevent direct modification
// of the read-only Navbar component, so we're creating a new wrapper

import OriginalNavbar from './NavbarOriginal';
import NotificationsDropdown from './NotificationsDropdown';

const Navbar = () => {
  return <OriginalNavbar NotificationsComponent={NotificationsDropdown} />;
};

export default Navbar;
