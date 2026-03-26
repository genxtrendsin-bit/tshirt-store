import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async ({
  adminId,
  action,
  entity,
  entityId,
  description
}) => {

  try {

    await ActivityLog.create({
      admin: adminId,
      action,
      entity,
      entityId,
      description
    });

  } catch (err) {

    console.error("Activity log error:", err);

  }

};