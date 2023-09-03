import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, Heading, MultiStep, Text, TextArea } from '@ignite-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormAnnotation, ProfileBox } from './styles';
import { api } from '../../../lib/axios';
import { Container, Header } from '../styles';

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

const UpdateProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  const session = useSession();
  const router = useRouter();

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('/users/update-profile', {
      bio: data.bio,
    });

    await router.push(`/schedule/${session.data?.user.username}`);
  }

  return (
    <>
      <NextSeo
        title="Atualize seu perfil | Ignite Call"
        noindex
      />
      <Container>
        <Header>
          <Heading as="strong">Bem vindo ao Ignite Call</Heading>

          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você pode editar
            essas informações depois.
          </Text>

          <MultiStep
            size={4}
            currentStep={4}
          />
        </Header>

        <ProfileBox
          as="form"
          onSubmit={handleSubmit(handleUpdateProfile)}
        >
          <label>
            <Text size="sm">Foto de pefil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea
              placeholder="Seu nome"
              {...register('bio')}
            />

            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  );
};

export default UpdateProfile;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  return {
    props: {
      session,
    },
  };
};
