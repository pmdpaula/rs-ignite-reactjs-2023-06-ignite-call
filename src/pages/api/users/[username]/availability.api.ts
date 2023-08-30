import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const username = String(req.query.username);

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      message: 'Date not provided',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  const referenceDate = dayjs(String(date));

  const isPastDate = referenceDate.endOf('day').isBefore(dayjs(), 'day');

  if (isPastDate) {
    return res.json({ possibleHours: [], availableHours: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  });

  if (!userAvailability) {
    return res.json({ possibleHours: [], availableHours: [] });
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = Math.floor(time_start_in_minutes / 60);
  const endHour = Math.floor(time_end_in_minutes / 60);

  const possibleHours = Array.from({ length: endHour - startHour }).map((_, index) => {
    return startHour + index;
  });

  const lockedHours = await prisma.scheduling.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
    select: {
      date: true,
    },
  });

  const availableHours = possibleHours.filter((hour) => {
    const isHourLocked = lockedHours.some((lockedHour) => {
      return dayjs(lockedHour.date).get('hour') === hour;
    });

    const isHourInThePast = referenceDate.set('hour', hour).isBefore(dayjs(), 'minute');

    return !isHourLocked && !isHourInThePast;
  });

  return res.json({ possibleHours, availableHours });
}
