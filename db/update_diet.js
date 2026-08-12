const {prisma} = require('./index');

async function run() {
  await prisma.user.update({where:{phone_number:'+91 9876543212'},data:{diet_type:'nonveg'}});
  await prisma.user.update({where:{phone_number:'+91 9876543213'},data:{diet_type:'nonveg'}});
  await prisma.user.update({where:{phone_number:'+91 9876543215'},data:{diet_type:'egg'}});
  console.log('Diet types updated');
  await prisma.$disconnect();
}

run();
