#include "../headers/calendar_optimizer.h"
#include <iostream>
#include <algorithm>
#include <ranges>

CalendarHolidayOptimizer::CalendarHolidayOptimizer(int year) : CalendarHolidayOptimizer(year, 0) {}

CalendarHolidayOptimizer::CalendarHolidayOptimizer(int year, int holidayCount) : calendarYear(year), numberOfHolidays(holidayCount)
{
  calendar = new Calendar(year);
  setupDaysInYear();
  optimize();
}

void CalendarHolidayOptimizer::setupDaysInYear()
{
  daysInYear.push_back(Date());
  MONTH currentMonth = JANURAY;
  int currentNumberOfDaysInMonth = 0;
  for (int day = 1; day <= 365; ++day)
  {
    ++currentNumberOfDaysInMonth;
    DAY currentDay = calendar->getDayForDate(calendarYear, currentMonth, currentNumberOfDaysInMonth);
    Date currentDate = Date(calendarYear, currentMonth, currentNumberOfDaysInMonth, currentDay, day);
    daysInYear.push_back(currentDate);

    if (currentNumberOfDaysInMonth == Calendar::getNumberOfDaysInMonth(calendarYear, currentMonth))
    {
      ++currentMonth;
      currentNumberOfDaysInMonth = 0;
    }
  }
}

Calendar *CalendarHolidayOptimizer::getCalendar()
{
  return calendar;
}

struct DateGap
{
  Date startDate;
  Date endDate;
  int gapLen;
  DateGap(Date st, Date en, int gapLen) : startDate(st), endDate(en), gapLen(gapLen) {}
};

void CalendarHolidayOptimizer::optimize()
{
  std::vector<DateGap> gaps;
  int gapLen = 0;
  Date startDate = daysInYear[0];
  Date endDate = calendar->isHoliday(startDate) ? daysInYear[0] : startDate;
  for (int day = 1; day < (int)daysInYear.size(); ++day)
  {
    Date today = daysInYear[day];
    if (calendar->isHoliday(today))
    {
      if (gapLen > 0)
      {
        gaps.push_back(DateGap(startDate, endDate, gapLen));
        startDate = daysInYear[0];
        gapLen = 0;
      }
    }
    else
    {
      gapLen++;
      endDate = today;
      if (startDate.dayOfMonth == 0)
      {
        startDate = today;
      }
    }
  }
  if (gapLen > 0)
    gaps.push_back(DateGap(startDate, endDate, gapLen));

  std::sort(gaps.begin(), gaps.end(), [](const DateGap &a, const DateGap &b)
            { 
      if(a.gapLen == b.gapLen) {
        return a.startDate.month < b.startDate.month;
      }
      return a.gapLen < b.gapLen; });

  auto smallGaps = gaps | std::ranges::views::filter([](DateGap a)
                                                     { return a.gapLen <= 3; });
  std::vector<Date> daysOffSelected;
  for (auto gap : smallGaps)
  {
    int startDateDayOfYear = gap.startDate.dayOfYear;
    int endDateDayOfYear = gap.endDate.dayOfYear;
    for (int i = startDateDayOfYear; i <= endDateDayOfYear; ++i)
    {
      daysOffSelected.push_back(daysInYear[i]);
    }
  }
  calendar->setDaysOff(daysOffSelected);
};

void CalendarHolidayOptimizer::updateHolidayCount(int newHolidayCount)
{
  numberOfHolidays = newHolidayCount;
  optimize();
}
