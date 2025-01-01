#ifndef __CCALENDAR_H
#define __CCALENDAR_H
#include <vector>
#include <map>
#include "types.h"

class Calendar
{
  static const std::map<MONTH, int> monthCode;
  static const int dayDisplayWidth = 5;
  static const int nationalHolidayColor = 32; // green
  static const int daysOffColor = 33;         // light green
  int year;
  std::vector<Date> nationalHolidays{
      NEW_YEAR,
      REPUBLIC_DAY,
      GANDHI_JAYANTI,
      CHRISTMAS,
      PONGAL,
      VASANT_PANCHAMI,
      HOLI,
      SHAHEEDI_DIVAS,
      GUDI_PADVA,
      RAMAZAAN,
      GOOD_FRIDAY,
      MAY_DAY,
      INDEPENDANCE_DAY,
      GANESH_CHATURTHI,
      DIWALI};
  std::vector<Date> daysOff;

public:
  Calendar(int calenderYear);
  static bool isLeapYear(int year);
  static int getNumberOfDaysInMonth(int year, MONTH month);
  static DAY getDayForDate(int year, MONTH month, int day);
  void printCalendarForMonth(int year, MONTH month);
  void printCalendarForYear(int year);
  bool isHoliday(Date date);
  bool isDayOff(Date date);
  void setDaysOff(std::vector<Date> daysOffSelected);
};

#endif
