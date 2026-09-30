// Attendance Service - User-Associated Records (NO section hierarchy)
// Record fields: id, user_id, date, check_in, check_out, status (PRESENT | LATE | ABSENT | HALF_DAY)

const CURRENT_USER_ID = 'INT-01';

const attendanceRecords = [];

export const attendanceService = {
  getAttendanceForUser: (userId = CURRENT_USER_ID) => {
    return attendanceRecords.filter((r) => r.user_id === userId);
  },

  getAttendanceStats: (userId = CURRENT_USER_ID) => {
    const userRecords = attendanceRecords.filter((r) => r.user_id === userId);
    const presentCount = userRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
    const totalSessions = userRecords.length;
    const rate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    return {
      rate: `${rate}%`,
      sessionsCount: `${presentCount} of ${totalSessions} sessions`,
      present: presentCount,
      late: userRecords.filter((r) => r.status === 'LATE').length,
      absent: userRecords.filter((r) => r.status === 'ABSENT').length,
      currentStreak: '0 Days'
    };
  }
};
