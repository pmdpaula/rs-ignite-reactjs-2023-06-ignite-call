import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { CaretLeft, CaretRight } from 'phosphor-react';
import { useMemo, useState } from 'react';

import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles';
import { api } from '../../lib/axios';
import { getWeekDays } from '../../utils/get-week-day';

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = Array<CalendarWeek>;

interface LockedDates {
  lockedWeekDays: number[];
  lockedDates: number[];
}

interface CalendarProps {
  selectedDate: Date | null;
  // eslint-disable-next-line no-unused-vars
  onDateSelected: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onDateSelected }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1);
  });

  const router = useRouter();

  function handlPreviousMonth() {
    const previousMonth = currentDate.subtract(1, 'month');

    setCurrentDate(previousMonth);
  }

  function handleNextMonth() {
    const nextMonth = currentDate.add(1, 'month');

    setCurrentDate(nextMonth);
  }

  const shortWeekDays = getWeekDays({ short: true });

  const currentMonth = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  const username = String(router.query.username);

  const { data: lockedDates } = useQuery<LockedDates>(
    ['locked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/locked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      });

      return response.data;
    },
  );

  const calendarWeeks = useMemo(() => {
    if (!lockedDates) {
      return [];
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set('date', index + 1);
    });

    const firstWeekDay = daysInMonthArray[0].day();

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day');
      })
      .reverse();

    const lastWeekDay = daysInMonthArray[daysInMonthArray.length - 1].day();

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return currentDate.add(index + 1, 'day');
    });

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            lockedDates.lockedWeekDays.includes(date.get('day')) ||
            lockedDates.lockedDates.includes(date.get('date')),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0;
        if (isNewWeek) {
          const week = original.slice(index, index + 7);

          weeks.push({
            week: weeks.length + 1,
            days: week,
          });
        }

        return weeks;
      },
      [],
    );

    return calendarWeeks;
  }, [currentDate, lockedDates]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            onClick={handlPreviousMonth}
            title="Mês Anterior"
          >
            <CaretLeft />
          </button>

          <button
            onClick={handleNextMonth}
            title="Mês Seguinte"
          >
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        onClick={() => onDateSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
};
