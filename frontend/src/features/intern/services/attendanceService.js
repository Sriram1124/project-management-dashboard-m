// Attendance Service - User-Associated Records (NO section hierarchy)
// Record fields: id, user_id, date, check_in, check_out, status (PRESENT | LATE | ABSENT | HALF_DAY)

const CURRENT_USER_ID = 'INT-01';

const attendanceRecords = [
  { id: 'att-101', user_id: CURRENT_USER_ID, date: 'Today, Dec 19, 2025', check_in: '09:02 AM', check_out: 'In Session', status: 'PRESENT', hours: '7h 15m' },
  { id: 'att-102', user_id: CURRENT_USER_ID, date: 'Wed, Dec 18, 2025', check_in: '08:58 AM', check_out: '05:45 PM', status: 'PRESENT', hours: '8h 47m' },
  { id: 'att-103', user_id: CURRENT_USER_ID, date: 'Tue, Dec 17, 2025', check_in: '09:28 AM', check_out: '06:05 PM', status: 'LATE', hours: '8h 37m' },
  { id: 'att-104', user_id: CURRENT_USER_ID, date: 'Mon, Dec 16, 2025', check_in: '09:05 AM', check_out: '05:30 PM', status: 'PRESENT', hours: '8h 25m' },
  { id: 'att-105', user_id: CURRENT_USER_ID, date: 'Fri, Dec 13, 2025', check_in: '08:50 AM', check_out: '05:15 PM', status: 'PRESENT', hours: '8h 25m' },
  { id: 'att-106', user_id: CURRENT_USER_ID, date: 'Thu, Dec 12, 2025', check_in: '09:00 AM', check_out: '05:00 PM', status: 'PRESENT', hours: '8h 00m' },
  { id: 'att-107', user_id: CURRENT_USER_ID, date: 'Wed, Dec 11, 2025', check_in: '-', check_out: '-', status: 'ABSENT', hours: '0h' },
  { id: 'att-108', user_id: CURRENT_USER_ID, date: 'Tue, Dec 10, 2025', check_in: '09:10 AM', check_out: '01:30 PM', status: 'HALF_DAY', hours: '4h 20m' },
  { id: 'att-109', user_id: CURRENT_USER_ID, date: 'Mon, Dec 09, 2025', check_in: '08:55 AM', check_out: '05:30 PM', status: 'PRESENT', hours: '8h 35m' }
];

export const attendanceService = {
  getAttendanceForUser: (userId = CURRENT_USER_ID) => {
    return attendanceRecords.filter((r) => r.user_id === userId);
  },

  getAttendanceStats: (userId = CURRENT_USER_ID) => {
    const userRecords = attendanceRecords.filter((r) => r.user_id === userId);
    const presentCount = userRecords.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
    const totalSessions = userRecords.length;
    const rate = Math.round((presentCount / (totalSessions || 1)) * 100);

    return {
      rate: `${rate}%`,
      sessionsCount: `${presentCount} of ${totalSessions} sessions`,
      present: presentCount,
      late: userRecords.filter((r) => r.status === 'LATE').length,
      absent: userRecords.filter((r) => r.status === 'ABSENT').length,
      currentStreak: '4 Days'
    };
  }
};
