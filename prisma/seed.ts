import { PrismaClient } from '../app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@xcode.com',
      password: adminPassword,
      name: 'Admin XCode',
      role: 'ADMIN'
    }
  })

  // Create Regular Users
  const user1Password = await bcrypt.hash('user123', 10)
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: user1Password,
      name: 'John Doe',
      role: 'USER'
    }
  })

  const user2Password = await bcrypt.hash('user456', 10)
  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: user2Password,
      name: 'Jane Smith',
      role: 'USER'
    }
  })

  // Create Classes with Videos
  const webDevClass = await prisma.class.create({
    data: {
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
      price: 299000,
      thumbnailUrl: '/images/web-dev-thumb.jpg',
      mentor: 'Alex Johnson',
      videos: {
        create: [
          {
            title: 'Introduction to HTML5',
            videoUrl: 'https://example.com/videos/html-intro.mp4',
            duration: 45,
            order: 1
          },
          {
            title: 'CSS Styling Basics',
            videoUrl: 'https://example.com/videos/css-basics.mp4',
            duration: 50,
            order: 2
          },
          {
            title: 'JavaScript Fundamentals',
            videoUrl: 'https://example.com/videos/js-fundamentals.mp4',
            duration: 60,
            order: 3
          }
        ]
      }
    }
  })

  const reactClass = await prisma.class.create({
    data: {
      title: 'Modern React Development',
      description: 'Master React.js with hooks, context, and modern best practices.',
      price: 499000,
      thumbnailUrl: '/images/react-thumb.jpg',
      mentor: 'Sarah Wilson',
      videos: {
        create: [
          {
            title: 'React Fundamentals',
            videoUrl: 'https://example.com/videos/react-basics.mp4',
            duration: 55,
            order: 1
          },
          {
            title: 'Working with Hooks',
            videoUrl: 'https://example.com/videos/react-hooks.mp4',
            duration: 65,
            order: 2
          },
          {
            title: 'State Management',
            videoUrl: 'https://example.com/videos/react-state.mp4',
            duration: 70,
            order: 3
          }
        ]
      }
    }
  })

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      totalAmount: webDevClass.price,
      status: 'COMPLETED',
      midtransOrderId: 'ORDER-001',
      orderItems: {
        create: {
          classId: webDevClass.id,
          price: webDevClass.price
        }
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      totalAmount: reactClass.price,
      status: 'COMPLETED',
      midtransOrderId: 'ORDER-002',
      orderItems: {
        create: {
          classId: reactClass.id,
          price: reactClass.price
        }
      }
    }
  })

  // Create UserClassVideo entries for purchased classes
  await prisma.userClassVideo.create({
    data: {
      userId: user1.id,
      classId: webDevClass.id,
      purchaseDate: new Date()
    }
  })

  await prisma.userClassVideo.create({
    data: {
      userId: user2.id,
      classId: reactClass.id,
      purchaseDate: new Date()
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
