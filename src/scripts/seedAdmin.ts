import { prisma } from '../lib/prisma';
import { UserRole } from '../middleware/auth';

async function seedAdmin() {
  try {
    const adminData = {
      name: 'Afnan Sayed',
      email: 'afnansayed@gmail.com',
      role: UserRole.ADMIN,
      password: 'admin1234',
    };

    console.log('***** The user is already exist or not !');
    const existAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    // console.log(existAdmin);

    if (existAdmin) {
      throw new Error('This user already exists.');
    }

    console.log('**** start  creating a admin.');
    const signupAdmin = await fetch(
      'http://localhost:5000/api/auth/sign-up/email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signupAdmin.ok) {
      console.log('Admin create successfully');

      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log('******** update user emailVerified status');
    }
    console.log('***** success ******');
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
