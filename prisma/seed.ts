import { PrismaClient } from '../app/generated/prisma'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 🔑 Buat admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'atmin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // 👤 Buat user biasa
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'member@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER'
    }
  })

  // 📚 Buat Class + Videos
  const class1 = await prisma.class.create({
    data: {
      title: 'Next.js Mastery',
      description: 'Pelajari Next.js dari dasar sampai advanced',
      price: 250000,
      thumbnailUrl: 'https://example.com/thumb/nextjs.jpg',
      mentor: 'Satya',
      videos: {
        create: [
          {
            title: 'Intro to Next.js',
            videoUrl: 'https://example.com/videos/next-intro.mp4',
            duration: 12,
            order: 1
          },
          {
            title: 'Routing in Next.js',
            videoUrl: 'https://example.com/videos/next-routing.mp4',
            duration: 18,
            order: 2
          },
          {
            title: 'API Routes & Prisma',
            videoUrl: 'https://example.com/videos/next-api.mp4',
            duration: 25,
            order: 3
          }
        ]
      }
    },
    include: { videos: true }
  })

  const class2 = await prisma.class.create({
    data: {
      title: 'React for Beginners',
      description: 'Mulai belajar React dengan project sederhana',
      price: 150000,
      thumbnailUrl: 'https://example.com/thumb/react.jpg',
      mentor: 'Jane Smith',
      videos: {
        create: [
          {
            title: 'Intro to React',
            videoUrl: 'https://example.com/videos/react-intro.mp4',
            duration: 10,
            order: 1
          },
          {
            title: 'Components & Props',
            videoUrl: 'https://example.com/videos/react-components.mp4',
            duration: 20,
            order: 2
          }
        ]
      }
    },
    include: { videos: true }
  })

  // 🛒 Create orders and access for regular user
  // Order for class1
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: class1.price,
      status: 'COMPLETED',
      orderItems: {
        create: {
          classId: class1.id,
          price: class1.price
        }
      }
    },
    include: { orderItems: true }
  })

  // Order for class2
  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: class2.price,
      status: 'COMPLETED',
      orderItems: {
        create: {
          classId: class2.id,
          price: class2.price
        }
      }
    },
    include: { orderItems: true }
  })

  // 🎟️ Grant access to purchased classes for regular user
  await prisma.userClassVideo.create({
    data: {
      userId: user.id,
      classId: class1.id,
      purchaseDate: new Date('2025-09-01') // Set specific date for testing
    }
  })

  await prisma.userClassVideo.create({
    data: {
      userId: user.id,
      classId: class2.id,
      purchaseDate: new Date('2025-09-02')
    }
  })

  // Create test users with different scenarios
  const testUser1 = await prisma.user.create({
    data: {
      email: 'test1@example.com',
      password: await bcrypt.hash('test123', 10),
      name: 'Test User 1',
      role: 'USER'
    }
  })

  const testUser2 = await prisma.user.create({
    data: {
      email: 'test2@example.com',
      password: await bcrypt.hash('test123', 10),
      name: 'Test User 2',
      role: 'USER'
    }
  })

  // Create orders for test users
  const testOrder1 = await prisma.order.create({
    data: {
      userId: testUser1.id,
      totalAmount: class2.price,
      status: 'COMPLETED',
      orderItems: {
        create: {
          classId: class2.id,
          price: class2.price
        }
      }
    }
  })

  const testOrder2 = await prisma.order.create({
    data: {
      userId: testUser2.id,
      totalAmount: class1.price + class2.price,
      status: 'COMPLETED',
      orderItems: {
        create: [
          {
            classId: class1.id,
            price: class1.price
          },
          {
            classId: class2.id,
            price: class2.price
          }
        ]
      }
    }
  })

  // Grant access to purchased classes for test users
  await prisma.userClassVideo.create({
    data: {
      userId: testUser1.id,
      classId: class2.id,
      purchaseDate: new Date('2025-09-03')
    }
  })

  await prisma.userClassVideo.createMany({
    data: [
      {
        userId: testUser2.id,
        classId: class1.id,
        purchaseDate: new Date('2025-09-04')
      },
      {
        userId: testUser2.id,
        classId: class2.id,
        purchaseDate: new Date('2025-09-04')
      }
    ]
  })

  console.log('✅ Seed data created successfully!')
  console.log({
    admin,
    user,
    testUser1,
    testUser2,
    class1,
    class2,
    orders: {
      order1,
      order2,
      testOrder1,
      testOrder2
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
