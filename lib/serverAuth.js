import prisma from "@/lib/prisma"
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from 'next-auth';

const serverAuth = async (req, res) => {
  const session = await getServerSession(options);

  if (!session?.user.email) {
    throw new Error('Not signed in or Session expired');
  } 

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    }
  });

  if (!currentUser) {
    throw new Error('Not signed in or Session expired');
  }

  return { currentUser };
};

export default serverAuth;