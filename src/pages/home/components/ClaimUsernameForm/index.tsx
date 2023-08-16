import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormAnnotation } from './styles';

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'O nome de usuário deve conter apenas letras e hífens',
    })
    .transform((value) => value.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export const ClaimUsernameForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  });

  const router = useRouter();

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data;

    await router.push(`/register/?username=${username}`);
  }

  return (
    <>
      <Form
        as="form"
        onSubmit={handleSubmit(handleClaimUsername)}
      >
        <TextInput
          placeholder="seu-usuário"
          size="sm"
          prefix="ignite.com/"
          {...register('username')}
          crossOrigin={undefined}
        />

        <Button
          size="sm"
          type="submit"
          disabled={isSubmitting}
        >
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username?.message
            : 'Digite o nome de usuário desejado!'}
        </Text>
      </FormAnnotation>
    </>
  );
};
