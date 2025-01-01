#include "../headers/calendar.h"
#include <iostream>
#include <iomanip>

void SetColor(int textColor)
{
  std::cout << "\033[" << textColor << "m";
}

void ResetColor() { std::cout << "\033[0m"; }

Calendar::Calendar(int calenderYear)
{
  year = calenderYear;
}

const std::map<MONTH, int> Calendar::monthCode = {
    {JANURAY, 0},
    {FEBRUARY, 3},
    {MARCH, 2},
    {APRIL, 5},
    {MAY, 0},
    {JUNE, 3},
    {JULY, 5},
    {AUGUST, 1},
    {SEPTEMBER, 4},
    {OCTOBER, 6},
    {NOVEMBER, 2},
    {DECEMBER, 4}};

bool Calendar::isLeapYear(int year)
{
  if (year % 4 != 0)
    return false;
  if (year % 100 != 0)
    return true;
  return (year % 400 == 0);
}

int Calendar::getNumberOfDaysInMonth(int year, MONTH month)
{
  switch (month)
  {
  case JANURAY:
  case MARCH:
  case MAY:
  case JULY:
  case AUGUST:
  case OCTOBER:
  case DECEMBER:
    return 31;
  case APRIL:
  case JUNE:
  case SEPTEMBER:
  case NOVEMBER:
    return 30;
  case FEBRUARY:
    return isLeapYear(year) ? 29 : 28;
  default:
    return 30;
  }
}

DAY Calendar::getDayForDate(int year, MONTH month, int day)
{
  year -= int(month) < 2;
  return DAY((year + year / 4 - year / 100 + year / 400 + monthCode.at(month) + day) % 7);
}

void Calendar::printCalendarForMonth(int year, MONTH month)
{
  // Display Month and Header Row.
  std::cout << std::setw(dayDisplayWidth * 3) << " " << std::setw(dayDisplayWidth) << getMonthLabelForMonth(month) << std::endl;
  for (int day = SUNDAY; day <= SATURDAY; ++day)
  {
    if (getDayLabelForDay(DAY(day)) == "Sun" || getDayLabelForDay(DAY(day)) == "Sat")
    {
      SetColor(nationalHolidayColor);
    }
    std::cout << std::setw(dayDisplayWidth) << getDayLabelForDay(DAY(day));
    ResetColor();
  }
  std::cout << std::endl;
  // Display the Calendar.
  int daysInMonth = getNumberOfDaysInMonth(year, month);
  int dayCount = 1;
  for (int row = 0; row < 6 && dayCount <= daysInMonth; ++row)
  {
    for (int col = 0; col < 7 && dayCount <= daysInMonth; ++col)
    {
      if (row == 0 && col < int(getDayForDate(year, month, 1)))
      {
        std::cout << std::setw(dayDisplayWidth) << " ";
      }
      else
      {
        if (col == 0 || col == 6 || isHoliday(Date(month, dayCount, getDayForDate(year, month, dayCount))))
          SetColor(nationalHolidayColor);
        else if (isDayOff(Date(month, dayCount, getDayForDate(year, month, dayCount))))
          SetColor(daysOffColor);
        std::cout << std::setw(dayDisplayWidth) << dayCount++;
        ResetColor();
      }
    }
    std::cout << std::endl;
  }
  // Display the divider.
  std::string divider = "_";
  while ((int)divider.size() < dayDisplayWidth * 7)
    divider += "_";
  std::cout << divider << std::endl;
}

void Calendar::printCalendarForYear(int year)
{
  for (int month = JANURAY; month <= DECEMBER; ++month)
  {
    printCalendarForMonth(year, MONTH(month));
  }
}

bool Calendar::isHoliday(Date date)
{
  for (Date nationalHoliday : nationalHolidays)
    if (date == nationalHoliday)
      return true;
  return date.day == SUNDAY || date.day == SATURDAY;
}

bool Calendar::isDayOff(Date date)
{
  for (Date dayOff : daysOff)
  {
    if (date == dayOff)
    {
      return true;
    }
  }
  return false;
}

void Calendar::setDaysOff(std::vector<Date> daysOffSelected)
{
  daysOff = daysOffSelected;
}
