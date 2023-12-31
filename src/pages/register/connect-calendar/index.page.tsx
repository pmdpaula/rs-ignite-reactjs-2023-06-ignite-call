import { Button, Heading, MultiStep, Text } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { ArrowRight, Check } from 'phosphor-react';

import { AuthError, ConnectBox, ConnectItem } from './styles';
import { Container, Header } from '../styles';

const ConnectCalendar = () => {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isConnected = session.status === 'authenticated';

  function handleConnectCalendar() {
    signIn('google');
  }

  function handleSignOut() {
    signOut();
  }

  function handleNavigateToNextStep() {
    router.push('/register/time-intervals');
  }

  return (
    <>
      <NextSeo
        title="Conecte sua agenda do Google | Ignite Call"
        noindex
      />
      <Container>
        <Header>
          <Heading as="strong">Conecte sua agenda!</Heading>

          <Text>
            Conecte o seu calendário para verificar automaticamente as horas ocupadas e os
            novos eventos à medida em que são agendados.
          </Text>

          <MultiStep
            size={4}
            currentStep={2}
          />
        </Header>

        <ConnectBox>
          <ConnectItem>
            <Text>Google Calendar</Text>

            {isConnected ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
              >
                Desconectar <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleConnectCalendar}
              >
                Conectar <ArrowRight />
              </Button>
            )}
          </ConnectItem>

          {hasAuthError && (
            <AuthError size="xs">
              Falha ao se conectar ao Google, verifique se habilitou as permissões de
              acesso ao Google Calendar.
            </AuthError>
          )}

          <Button
            onClick={handleNavigateToNextStep}
            type="submit"
            disabled={!isConnected}
          >
            Próximo passo
            <ArrowRight />
          </Button>

          {/* <Button
            onClick={() => signOut()}
            // disabled={isSubmitting}
          >
            SignOut
            <ArrowRight />
          </Button> */}
        </ConnectBox>
      </Container>
    </>
  );
};

export default ConnectCalendar;
