import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from './styles';
import { api } from '../../../lib/axios';
import { converTimeStringToMinutes } from '../../../utils/convert-time-string-to-minutes';
import { getWeekDays } from '../../../utils/get-week-day';
import { Container, Header } from '../styles';

const timeIntervalFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: converTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: converTimeStringToMinutes(interval.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every((interval) => {
          return interval.endTimeInMinutes >= interval.startTimeInMinutes + 60;
        });
      },
      { message: 'O intervalo de horário precisa ser de pelo menos 1 hora.' },
    ),
});

type TimeIntervalFormInput = z.input<typeof timeIntervalFormSchema>;
type TimeIntervalFormOutput = z.output<typeof timeIntervalFormSchema>;

const TimeIntervals = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<TimeIntervalFormInput, any, TimeIntervalFormOutput>({
    resolver: zodResolver(timeIntervalFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  });

  const router = useRouter();

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  });

  const intervals = watch('intervals');

  async function handleTimeIntervals(data: TimeIntervalFormOutput) {
    const { intervals } = data;
    await api.post('/users/time-intervals', { intervals });

    await router.push('/register/update-profile');
  }

  const weekDays = getWeekDays({});

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>

        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da semana.
        </Text>

        <MultiStep
          size={4}
          currentStep={3}
        />
      </Header>

      <IntervalBox
        as="form"
        onSubmit={handleSubmit(handleTimeIntervals)}
      >
        <IntervalContainer>
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
                        checked={field.value}
                      />
                    );
                  }}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>

              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                  {...register(`intervals.${index}.startTime`)}
                  crossOrigin={undefined}
                />

                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  disabled={!intervals[index].enabled}
                  {...register(`intervals.${index}.endTime`)}
                  crossOrigin={undefined}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalContainer>

        {errors.intervals && <FormError size="sm">{errors.intervals.message}</FormError>}

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Próximo passo <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
};

export default TimeIntervals;
