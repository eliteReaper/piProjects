#ifndef __COPTIMIZER_H
#define __COPTIMZER_H
#include "calendar.h"

class CalendarHolidayOptimizer
{
  // Input.
  int numberOfHolidays;
  int calendarYear;
  std::vector<Date> daysInYear;
  Calendar *calendar;

  void setupDaysInYear();

public:
  CalendarHolidayOptimizer(int year);
  CalendarHolidayOptimizer(int year, int holidayCount);

  Calendar *getCalendar();
  void optimize();
  void updateHolidayCount(int newHolidayCount);
};

#endif