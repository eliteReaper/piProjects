#include "headers/calendar_optimizer.h"

int main()
{
  CalendarHolidayOptimizer optimizer{2025};
  optimizer.getCalendar()->printCalendarForYear(2025);
  return 0;
}