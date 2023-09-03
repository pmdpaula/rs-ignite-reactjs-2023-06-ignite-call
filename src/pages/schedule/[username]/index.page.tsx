import { Avatar, Heading, Text } from '@ignite-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

import ScheduleForm from './ScheduleForm';
import { Container, UserHeader } from './styles';
import { prisma } from '../../../lib/prisma';

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

const Schedule = ({ user }: ScheduleProps) => {
  const { name, bio, avatarUrl } = user;

  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />
      <Container>
        <UserHeader>
          <Avatar src={avatarUrl} />

          <Heading>{name}</Heading>
          <Text>{bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  );
};

export default Schedule;

export const getStaticPaths: GetStaticPaths = async () => {
  // o retorno como feito abaixo, faz com que não gere nenhuma página estática
  // no momento da build e sim, apenas quando o usuário acessar a página
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },

    revalidate: 60 * 60 * 24, // 24 hours
  };
};
