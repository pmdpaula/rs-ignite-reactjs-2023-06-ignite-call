import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { prisma } from '../../../lib/prisma';
import { buildNextAtuhOptions } from '../auth/[...nextauth].api';

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, buildNextAtuhOptions(req, res));

  if (!session) {
    return res.status(401).end();
  }

  const { intervals } = timeIntervalsBodySchema.parse(req.body);

  // Com um banco difernte do SQLite poderíamos usar o createMany
  // await prisma.userTimeInterval.createMany()

  await Promise.all(
    intervals.map(async (interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    }),
  );

  return res.status(201).end();
};

export default handler;
