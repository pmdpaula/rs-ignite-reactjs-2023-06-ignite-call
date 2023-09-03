import dayjs from 'dayjs';
import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { getGoogleOAuthToken } from '../../../../lib/google';
import { prisma } from '../../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const username = String(req.query.username);

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

  const createSchedulingBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  });

  const { name, email, observations, date } = createSchedulingBodySchema.parse(req.body);

  const schedulingDate = dayjs(date).startOf('hour');

  if (schedulingDate.isBefore(dayjs(), 'hour')) {
    return res.status(400).json({
      message: 'Date is in the past',
    });
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  });

  if (conflictingScheduling) {
    return res.status(409).json({
      message: 'There is another scheduling at the same time.',
    });
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  });

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  });

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      attendees: [
        {
          email,
          displayName: name,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  });

  return res.status(201).end();
}
