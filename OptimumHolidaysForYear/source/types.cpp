#include "../headers/types.h"
#include <string>
#include <iostream>

std::string getDayLabelForDay(DAY day)
{
  switch (day)
  {
  case 0:
    return "Sun";
  case 1:
    return "Mon";
  case 2:
    return "Tue";
  case 3:
    return "Wed";
  case 4:
    return "Thu";
  case 5:
    return "Fri";
  case 6:
    return "Sat";
  default:
    return "Unknown";
  }
}

MONTH operator++(MONTH &month)
{
  month = MONTH((int(month) + 1) % 12);
  return month;
}

std::string getMonthLabelForMonth(MONTH month)
{
  switch (month)
  {
  case JANURAY:
    return "Jan";
  case FEBRUARY:
    return "Feb";
  case MARCH:
    return "Mar";
  case APRIL:
    return "Apr";
  case MAY:
    return "May";
  case JUNE:
    return "Jun";
  case JULY:
    return "Jul";
  case AUGUST:
    return "Aug";
  case SEPTEMBER:
    return "Sep";
  case OCTOBER:
    return "Oct";
  case NOVEMBER:
    return "Nov";
  case DECEMBER:
    return "Dec";
  default:
    return "Unknown";
  }
}

std::ostream &operator<<(std::ostream &stream, Date date)
{
  stream << getMonthLabelForMonth(date.month) << " " << date.dayOfMonth;
  return stream;
}
