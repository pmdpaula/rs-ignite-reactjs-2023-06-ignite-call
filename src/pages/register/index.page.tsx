import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Container, Form, FormError, Header } from './styles';

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    .regex(/^([a-z\\\\-]+)$/i, {
      message: 'O nome de usuário deve conter apenas letras e hífens',
    })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister(data: RegisterFormData) {
    console.log('🚀 ~ file: index.page.tsx:33 ~ handleRegister ~ data:', data);
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem vindo ao Ignite Call</Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode editar
          essas informações depois.
        </Text>

        <MultiStep
          size={4}
          currentStep={1}
        />
      </Header>

      <Form
        as="form"
        onSubmit={handleSubmit(handleRegister)}
      >
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
            crossOrigin={undefined}
          />
          {errors.username ? (
            <FormError size="xs">{errors.username.message}</FormError>
          ) : (
            <Box style={{ border: 0, padding: 0, margin: 0, height: '1.2rem' }} />
          )}
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput
            placeholder="Seu nome"
            {...register('username')}
            {...register('name')}
            crossOrigin={undefined}
          />
          {errors.name ? (
            <FormError size="xs">{errors.name.message}</FormError>
          ) : (
            <Box style={{ border: 0, padding: 0, margin: 0, height: '1.2rem' }} />
          )}
        </label>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
