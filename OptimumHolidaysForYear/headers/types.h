#ifndef __CTYPES_H
#define __CTYPES_H
#include <string>

enum MONTH
{
  JANURAY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER
};
extern std::string getMonthLabelForMonth(MONTH month);
extern MONTH operator++(MONTH &month);

enum DAY
{
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
};
extern std::string getDayLabelForDay(DAY day);

struct Date
{
  int year;
  MONTH month;
  int dayOfMonth;
  DAY day;
  int dayOfYear;
  bool isHoliday;

  Date() : Date(JANURAY, 0) {};
  Date(MONTH m, int d)
  {
    month = m;
    dayOfMonth = d;
  }
  Date(MONTH m, int d, DAY weekday)
  {
    month = m;
    dayOfMonth = d;
    day = weekday;
  }
  Date(int y, MONTH m, int d, DAY w, int dy, bool holiday = false)
  {
    year = y;
    month = m;
    dayOfMonth = d;
    day = w;
    dayOfYear = dy;
    isHoliday = holiday;
  }

  bool operator==(Date date)
  {
    return month == date.month && dayOfMonth == date.dayOfMonth;
  }

  void setHoliday()
  {
    isHoliday = true;
  }
};

extern std::ostream &operator<<(std::ostream &stream, Date date);

const Date NEW_YEAR = Date(JANURAY, 1);
const Date REPUBLIC_DAY = Date(JANURAY, 26);
const Date GANDHI_JAYANTI = Date(OCTOBER, 2);
const Date CHRISTMAS = Date(DECEMBER, 25);
const Date PONGAL = Date(JANURAY, 14);
const Date VASANT_PANCHAMI = Date(FEBRUARY, 2);
const Date HOLI = Date(MARCH, 14);
const Date SHAHEEDI_DIVAS = Date(MARCH, 23);
const Date GUDI_PADVA = Date(MARCH, 30);
const Date RAMAZAAN = Date(MARCH, 31);
const Date GOOD_FRIDAY = Date(APRIL, 18);
const Date MAY_DAY = Date(MAY, 1);
const Date INDEPENDANCE_DAY = Date(AUGUST, 15);
const Date GANESH_CHATURTHI = Date(AUGUST, 27);
const Date DIWALI = Date(OCTOBER, 20);

#endif