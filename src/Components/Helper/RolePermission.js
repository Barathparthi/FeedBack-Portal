// Utility function to check if the user has permission for a given action based on roleId
export const checkPermissions = (roleId) => {
    const permissions = {
      1: { canAdd: true, canEdit: true, canDelete: true }, // Full permissions
      2: { canAdd: true, canEdit: true, canDelete: false }, // Only add permissions
      default: { canAdd: false, canEdit: false, canDelete: false } // No permissions for other roles
    };
  
    return permissions[roleId] || permissions['default'];
  };
  