import { GetServerSideProps } from 'next';

const Campeonatos = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/campeonatos/ValorantEliteInvitational',
      permanent: false,
    },
  };
};

export default Campeonatos;
